import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export interface GenerateArticleParams {
  topic: string;
  keywords?: string;
  category?: string;
  country?: string;
  language?: string;
  tone?: string;
  length?: string;
  seo?: boolean;
  faqs?: boolean;
  bulletInsights?: boolean;
  currentTitle?: string;
  currentContent?: string;
}

export interface GeneratedArticleData {
  title: string;
  subtitle: string;
  slug: string;
  content: string[];
  excerpt: string;
  meta_description: string;
  tags: string[];
  category: string;
  bullet_insights: string[];
  breaking: boolean;
  featured: boolean;
  authorName?: string;
  authorRole?: string;
  readTime?: string;
  faqs?: { question: string; answer: string }[];
}

export interface FactCheckReport {
  factCheckScore: number;
  status: string;
  summary: string;
  verifiedClaims: string[];
  flaggedItems: { claim: string; issue: string; correction: string }[];
  suggestions: string[];
  sources?: { title: string; url: string }[];
}

export async function apiGenerateArticle(params: GenerateArticleParams): Promise<GeneratedArticleData> {
  const res = await fetch('/api/ai/article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to parse AI response');
  }

  return data.data;
}

export async function apiGenerateThumbnail(params: {
  topic: string;
  title?: string;
  keywords?: string;
  category?: string;
  country?: string;
  tone?: string;
}): Promise<string> {
  const res = await fetch('/api/ai/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  if (!data.success || !data.imageUrl) {
    throw new Error(data.error || 'Failed to generate image thumbnail');
  }

  const rawBase64Url = data.imageUrl;

  // Attempt to upload image to Firebase Storage for permanent URL hosting
  try {
    const filename = `thumbnail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.png`;
    const storageRef = ref(storage, `articles/thumbnails/${filename}`);
    await uploadString(storageRef, rawBase64Url, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (storageErr) {
    console.warn('Firebase Storage upload failed, using generated Data URL fallback:', storageErr);
    return rawBase64Url;
  }
}

export async function apiStreamRewrite(
  params: {
    text: string;
    action: string;
    language?: string;
    tone?: string;
    articleTitle?: string;
    category?: string;
  },
  onChunk: (chunkText: string) => void
): Promise<string> {
  const res = await fetch('/api/ai/rewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server error ${res.status}`);
  }

  if (!res.body) {
    throw new Error('No response body for SSE stream');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const payloadStr = trimmed.substring(6);
        if (payloadStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(payloadStr);
          if (parsed.text) {
            accumulated += parsed.text;
            onChunk(parsed.text);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch {
          // ignore parsing error for chunk
        }
      }
    }
  }

  return accumulated;
}

export async function apiImproveField(params: {
  field: string;
  topic?: string;
  title?: string;
  content?: string;
  keywords?: string;
  category?: string;
  language?: string;
  tone?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Improve field failed');
  }

  return data.data;
}

export async function apiFactCheck(params: {
  title: string;
  content: string;
  country?: string;
}): Promise<FactCheckReport> {
  const res = await fetch('/api/ai/factcheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Fact check failed');
  }

  return {
    ...data.data,
    sources: data.sources || [],
  };
}
