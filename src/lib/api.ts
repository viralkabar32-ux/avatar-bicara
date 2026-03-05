const BASE_URL = 'https://api.apifree.ai';
const MODEL = 'skywork-ai/skyreels-v3/standard/single-avatar';

/**
 * Upload a file to catbox.moe for public hosting.
 * Falls back to file.io if catbox fails.
 */
export async function uploadFile(file: File): Promise<string> {
  // Strategy 1: catbox.moe (permanent hosting)
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();
    if (text.trim().startsWith('https://')) {
      return text.trim();
    }
  } catch (e) {
    console.warn('Catbox upload failed, trying fallback:', e);
  }

  // Strategy 2: file.io
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://file.io', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.link) {
      return data.link;
    }
  } catch (e) {
    console.warn('file.io upload failed:', e);
  }

  // Strategy 3: litterbox (temporary catbox)
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('time', '72h');
    formData.append('fileToUpload', file);

    const response = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();
    if (text.trim().startsWith('https://')) {
      return text.trim();
    }
  } catch (e) {
    console.warn('Litterbox upload failed:', e);
  }

  throw new Error('UPLOAD_FAILED');
}

/**
 * Submit a video generation request to SkyReels API
 */
export async function submitVideoGeneration(
  apiKey: string,
  imageUrl: string,
  audioUrl: string,
  prompt: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/video/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audios: [audioUrl],
      first_frame_image: imageUrl,
      model: MODEL,
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorBody = await response.text();
      errorDetail = errorBody;
    } catch { /* ignore */ }
    throw new Error(
      `Gagal mengirim permintaan (${response.status}). ${errorDetail}`
    );
  }

  const data = await response.json();

  if (!data?.resp_data?.request_id) {
    throw new Error('Respons API tidak valid: request_id tidak ditemukan.');
  }

  return data.resp_data.request_id;
}

/**
 * Check the status of a video generation request
 */
export async function checkVideoStatus(
  apiKey: string,
  requestId: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/video/${requestId}/status`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal memeriksa status (${response.status})`);
  }

  const text = await response.text();

  // Try parsing as JSON
  try {
    const data = JSON.parse(text);

    // Handle nested status
    if (data?.resp_data?.status) return data.resp_data.status;
    if (data?.status) return data.status;
    if (typeof data === 'string') return data;

    // Check JSON string for keywords
    const jsonStr = JSON.stringify(data).toLowerCase();
    if (jsonStr.includes('"success"')) return 'success';
    if (jsonStr.includes('"error"') || jsonStr.includes('"failed"')) return 'error';
    return 'processing';
  } catch {
    // Handle plain text response
    const lower = text.toLowerCase().trim();
    if (lower.includes('success')) return 'success';
    if (lower.includes('error') || lower.includes('fail')) return 'error';
    return 'processing';
  }
}

/**
 * Get the result of a completed video generation
 */
export async function getVideoResult(
  apiKey: string,
  requestId: string
): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/v1/video/${requestId}/result`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil hasil video (${response.status})`);
  }

  const data = await response.json();

  if (!data?.resp_data?.video_list || data.resp_data.video_list.length === 0) {
    throw new Error('Tidak ada video yang ditemukan dalam respons.');
  }

  return data.resp_data.video_list;
}

/**
 * Poll status every 5 seconds until success or error.
 * Returns a cleanup function to stop polling.
 */
export function startPolling(
  apiKey: string,
  requestId: string,
  callbacks: {
    onStatusUpdate: (status: string) => void;
    onSuccess: (videoUrls: string[]) => void;
    onError: (errorMessage: string) => void;
  }
): () => void {
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const poll = async () => {
    if (stopped) return;

    try {
      const status = await checkVideoStatus(apiKey, requestId);
      if (stopped) return;

      callbacks.onStatusUpdate(status);

      if (status === 'success') {
        try {
          const videos = await getVideoResult(apiKey, requestId);
          if (!stopped) {
            callbacks.onSuccess(videos);
          }
        } catch (e) {
          if (!stopped) {
            callbacks.onError(
              e instanceof Error ? e.message : 'Gagal mengambil hasil video.'
            );
          }
        }
        return;
      }

      if (status === 'error' || status === 'failed') {
        if (!stopped) {
          callbacks.onError('Pembuatan video gagal di sisi server.');
        }
        return;
      }

      // Continue polling after 5 seconds
      timeoutId = setTimeout(poll, 5000);
    } catch (e) {
      if (!stopped) {
        callbacks.onError(
          e instanceof Error ? e.message : 'Gagal memeriksa status.'
        );
      }
    }
  };

  // Start first poll
  poll();

  // Return cleanup function
  return () => {
    stopped = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}
