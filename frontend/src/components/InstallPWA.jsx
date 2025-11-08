import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install button
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    // Remember user dismissed (optional)
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setShowInstall(false);
    }
  }, []);

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-200"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-cyan-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">
            Install Chatify App
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            Install our app for a better experience. Works offline and feels like a native app!
          </p>

          <button
            onClick={handleInstall}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;
