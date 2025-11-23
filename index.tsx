import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const FileViewer = ({ title, content, language = 'python' }: { title: string, content: string, language?: string }) => (
  <div className="mb-6 border rounded-lg overflow-hidden shadow-sm bg-white">
    <div className="bg-gray-100 px-4 py-2 border-b font-mono text-sm font-bold flex justify-between items-center">
      <span>{title}</span>
      <span className="text-xs text-gray-500 uppercase">{language}</span>
    </div>
    <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-gray-100">
      <code>{content}</code>
    </pre>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">GenAI Backend API</h1>
        <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">REAL IMPLEMENTATION</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">FastAPI</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Celery + Redis</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Diffusers (Flux)</span>
        </div>
      </header>

      <nav className="flex space-x-4 mb-6 border-b">
        {['overview', 'implementation', 'infrastructure'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold text-green-900 mb-2">Статус проекта: Полностью реализован</h2>
            <p className="text-green-800">
              Внимание: Файлы в этом проекте теперь являются реальным исходным кодом Backend-сервиса.
              Заглушки были заменены на рабочие реализации:
            </p>
            <ul className="list-disc pl-5 mt-2 text-green-800">
                <li>Интеграция с <strong>HuggingFace Diffusers</strong> (Flux Pipeline).</li>
                <li>Асинхронные воркеры <strong>Celery</strong>.</li>
                <li>БД <strong>PostgreSQL</strong> с асинхронным драйвером.</li>
                <li>Реальная загрузка в <strong>S3</strong>.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">API Layer (Real)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Entry: <code>app/main.py</code></li>
                    <li>Auth: <code>verify_api_key</code> (Dependency)</li>
                    <li>Validation: Pydantic v2 Models</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">ML Core (Real)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Provider: <code>app/providers/flux.py</code></li>
                    <li>Library: <code>diffusers</code></li>
                    <li>Features: LoRA Loading, GPU Offloading</li>
                </ul>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'implementation' && (
        <div className="space-y-4">
             <p className="text-sm text-gray-600 mb-4">Ниже приведены фрагменты реального кода, который теперь находится в файловой системе:</p>
             
             <FileViewer title="app/providers/flux.py" content={`class FluxProvider(ImageGenerationProvider):
    async def generate(self, params: Dict[str, Any]) -> List[bytes]:
        if self.pipe is None:
            self.load_model() # Loads Diffusers FluxPipeline

        # ... (LoRA loading logic) ...
        
        images = self.pipe(
            prompt,
            width=width,
            height=height,
            num_inference_steps=steps,
            # ...
        ).images
        
        # Returns raw bytes for S3 upload
        return image_bytes_list`} />

             <FileViewer title="app/worker.py" content={`@celery_app.task(name="generate_image_task", bind=True)
def generate_image_task(self, task_id_str, provider_name, params):
    # Bridge Sync Celery -> Async Logic
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_generation(task_id_str, provider_name, params))`} />
        </div>
      )}
      
      {activeTab === 'infrastructure' && (
          <div className="space-y-4">
              <FileViewer title="docker-compose.yml" language="yaml" content={`services:
  worker:
    build: .
    command: celery -A app.worker.celery_app worker
    environment:
      - C_FORCE_ROOT=true
    depends_on:
      - db
      - redis
      - minio`} />
          </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
