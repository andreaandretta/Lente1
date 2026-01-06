
import React from 'react';

export const DeploymentGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white italic">Cloud Build (Zero Install)</h2>
        <p className="text-slate-400">Non serve installare nulla. Useremo GitHub per compilare l'APK via browser.</p>
      </div>

      <div className="grid gap-6">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6">
          <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shrink-0">1</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Crea un Repository su GitHub</h3>
            <p className="text-slate-400 text-sm">Vai su <a href="https://github.com/new" target="_blank" className="text-indigo-400 underline">github.com/new</a> e crea un repository chiamato <b>"Lente-App"</b>.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6">
          <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shrink-0">2</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Carica i file via Browser</h3>
            <p className="text-slate-400 text-sm">Usa il pulsante <b>"Add file > Create new file"</b> su GitHub per copiare i file dalla tab <b>"Android Code"</b>.</p>
            <p className="text-xs text-amber-500 font-bold">IMPORTANTE: Rispetta esattamente i percorsi dei file (es: app/src/main/java/...)</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shrink-0">3</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Configura la Cloud Action</h3>
            <p className="text-slate-400 text-sm">Crea il file <code>.github/workflows/android.yml</code> e incolla il codice che trovi nella tab Android Code (primo file della lista).</p>
            <div className="bg-indigo-600/10 p-3 rounded-lg border border-indigo-500/20 mt-2">
              <p className="text-[10px] font-mono text-indigo-300">Questo file dice a GitHub di avviare un computer virtuale e compilare il tuo APK automaticamente.</p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6 shadow-xl shadow-indigo-500/10">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shrink-0">4</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Scarica l'APK</h3>
            <p className="text-slate-400 text-sm">Vai nella tab <b>"Actions"</b> del tuo repository GitHub:</p>
            <ol className="text-xs text-slate-300 list-decimal list-inside space-y-2 mt-3">
              <li>Clicca sull'ultimo workflow chiamato "Android CI/CD".</li>
              <li>Aspetta che diventi verde (circa 3-5 minuti).</li>
              <li>Scorri in basso fino a <b>"Artifacts"</b>.</li>
              <li>Clicca su <b>"Lente-Debug-APK"</b> per scaricare lo zip con l'APK pronto da installare!</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-magic"></i> Come farti aiutare da Claude Extension
        </h4>
        <p className="text-slate-400 text-sm leading-relaxed">
          Puoi dare i file a Claude e chiedergli: <br/>
          <span className="text-indigo-400 italic">"Ho questi file per un progetto Android. Mi aiuti a generare il comando git per pusharli su GitHub o a sistemare eventuali errori di compilazione nel file build.gradle?"</span>
        </p>
      </div>
    </div>
  );
};
