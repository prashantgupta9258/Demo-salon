import React, { useState } from "react";
import { MessageCircle, Sparkles, X, Send } from "lucide-react";

export default function WhatsAppAIChat() {
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [customMessage, setCustomMessage] = useState("Hi Demo Salon AI, I want to know about your services and book an appointment.");

  const startWhatsAppAI = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(`[AI Assistant Request] ${customMessage}`);
    const whatsappUrl = `https://wa.me/917818066137?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
    setShowPromptModal(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button with AI integration */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Tooltip / Prompt bubble */}
        <div className="bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-200 animate-bounce flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>Chat with WhatsApp AI Assistant</span>
        </div>

        {/* Main WhatsApp Button */}
        <button
          onClick={() => setShowPromptModal(true)}
          aria-label="Open WhatsApp AI Chat"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group relative"
        >
          <span className="absolute -top-1 -right-1 bg-[#128C7E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white flex items-center gap-0.5 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" /> AI
          </span>
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-medium pl-0 group-hover:pl-3">
            WhatsApp AI Chat
          </span>
        </button>
      </div>

      {/* Quick Prompt Modal to start WhatsApp AI chat directly on WhatsApp */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">WhatsApp AI Assistant</h3>
                  <p className="text-xs text-emerald-200">Continue directly on WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                Our AI chatbot will open directly in your WhatsApp app/web to help you with salon services, pricing, and booking instantly!
              </p>

              <form onSubmit={startWhatsAppAI} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    What would you like to ask the WhatsApp AI?
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#25D366] text-gray-800"
                    placeholder="Type your question for WhatsApp AI..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Start AI Chat on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
