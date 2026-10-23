"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Bot, ShoppingBag, CreditCard, Tag, HelpCircle, PhoneCall, ChevronRight, Package, Users, Settings } from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: any;
  questions: { q: string; a: string }[];
}

const clientSections: Section[] = [
  {
    id: "compras",
    title: "Ayuda para Comprar",
    icon: ShoppingBag,
    questions: [
      {
        q: "¿Cómo hago una compra en la tienda?",
        a: "¡Es muy fácil! Navega por las categorías, agrega tus productos favoritos al carrito, ve al carrito, llena tus datos y confirma tu pedido paso a paso."
      },
      {
        q: "¿Cómo sé si mi pedido quedó confirmado?",
        a: "Una vez finalices el proceso de pago con Wompi o el método elegido, verás la confirmación en pantalla y te enviaremos el comprobante."
      }
    ]
  },
  {
    id: "pagos",
    title: "Métodos de Pago (Wompi)",
    icon: CreditCard,
    questions: [
      {
        q: "¿Qué métodos de pago acepta Wompi?",
        a: "Puedes pagar con Tarjeta de Crédito, PSE (débito bancario), Nequi, DaviPlata o efectivo en puntos aliados de forma 100% segura."
      },
      {
        q: "¿Es seguro pagar por la plataforma?",
        a: "¡Totalmente! Wompi utiliza estándares de seguridad bancaria encriptados para proteger todos tus datos financieros."
      }
    ]
  },
  {
    id: "cupones",
    title: "Cupones y Descuentos",
    icon: Tag,
    questions: [
      {
        q: "¿Cómo consigo cupones de descuento?",
        a: "¡Suscríbete a nuestras novedades o escríbenos al WhatsApp para enterarte de códigos promocionales y sorpresas exclusivas!"
      },
      {
        q: "¿Dónde aplico mi cupón?",
        a: "En la pantalla del carrito de compras verás una casilla especial para ingresar tu código antes de proceder al pago."
      }
    ]
  },
  {
    id: "envios",
    title: "Envíos y Tiempos",
    icon: HelpCircle,
    questions: [
      {
        q: "¿Cuánto tarda en llegar mi pedido?",
        a: "En Manizales entregamos de 1 a 2 días hábiles. Para el resto del país, los despachos por Inter Rapidísimo tardan entre 3 y 5 días hábiles."
      },
      {
        q: "¿Cuánto cuesta el envío?",
        a: "Manejamos tarifas estándar: Manizales $8.000, ciudades principales $15.000 y resto del país $20.000. Si hay variación, te contactamos."
      }
    ]
  }
];

const adminSections: Section[] = [
  {
    id: "admin-pedidos",
    title: "Gestión de Pedidos",
    icon: Package,
    questions: [
      {
        q: "¿Cómo veo los pedidos nuevos?",
        a: "Ve al menú lateral del panel y haz clic en 'Pedidos'. Allí verás la lista de compras realizadas por los clientes con su estado."
      },
      {
        q: "¿Cómo cambio el estado de un pedido?",
        a: "En la tabla de pedidos, puedes actualizar el estatus (pendiente, enviado, entregado) haciendo clic sobre las opciones de control de cada orden."
      }
    ]
  },
  {
    id: "admin-clientes",
    title: "Control de Clientes",
    icon: Users,
    questions: [
      {
        q: "¿Cuál es la diferencia entre 'Invitado' y 'Con cuenta'?",
        a: "Los 'Invitados' compraron rápido sin registrar contraseña. Los que tienen etiqueta 'Con cuenta' ya se registraron formalmente en la sección /cuenta."
      },
      {
        q: "¿Se actualiza si un invitado se registra después?",
        a: "¡Sí! El sistema actualiza automáticamente su perfil en /admin/clientes usando su correo para no duplicar datos."
      }
    ]
  },
  {
    id: "admin-sistema",
    title: "Soporte Técnico Rápido",
    icon: Settings,
    questions: [
      {
        q: "¿Qué hago si algo no guarda en la base de datos?",
        a: "Verifica que tengas conexión a internet y revisa la consola de la terminal (npm run dev) por si hay algún error de tipado o de Supabase."
      },
      {
        q: "¿Cómo reinicio el servidor local si se pega?",
        a: "En tu terminal de VS Code presiona Ctrl + C para detenerlo y vuelve a escribir 'npm run dev' para arrancarlo limpio."
      }
    ]
  }
];

export default function ChatBot() {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes("/admin") ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"menu" | "section" | "chat">("menu");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [conversation, setConversation] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { 
      sender: "bot", 
      text: isAdminPage 
        ? "🛠️ Panel de Ayuda para Administrador. ¿En qué gestión te atoraste?" 
        : "✨ ¡Hola! Bienvenido a Natt Store. ¿En qué te podemos colaborar hoy?" 
    }
  ]);

  const activeSections = isAdminPage ? adminSections : clientSections;

  const handleSelectSection = (section: Section) => {
    setSelectedSection(section);
    setCurrentView("section");
  };

  const handleSelectQuestion = (q: string, a: string) => {
    setConversation((prev) => [
      ...prev,
      { sender: "user", text: q },
      { sender: "bot", text: a }
    ]);
    setCurrentView("chat");
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "573104492871";
    const message = isAdminPage 
      ? "Hola soporte técnico, tengo una consulta sobre el panel de administración de Natt Store."
      : "¡Hola! 👋 Vengo de la tienda Natt Store y tengo una duda con mi compra o mis productos.";
    window.open(`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Botón de WhatsApp separado de forma limpia y accesible */}
      {!isAdminPage && (
        <button
          onClick={handleWhatsAppRedirect}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative z-50"
          aria-label="Abrir WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute right-full mr-3 bg-white text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-emerald-100 pointer-events-none">
            ¡Escríbenos al WhatsApp! 📱
          </span>
        </button>
      )}

      {/* Botón del Asistente Virtual */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative z-50 ${
            isAdminPage ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-pink-600 hover:bg-pink-700 text-white"
          }`}
          aria-label="Asistente virtual"
        >
          <MessageCircle className="w-6 h-6" />
          <span className={`absolute right-full mr-3 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border pointer-events-none ${
            isAdminPage ? "text-amber-700 border-amber-100" : "text-pink-700 border-pink-100"
          }`}>
            {isAdminPage ? "Ayuda Admin 🛠️" : "¿Necesitas ayuda? 💬"}
          </span>
        </button>
      )}

      {/* Ventana del Chat Abierta */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden h-[520px] transition-all animate-in fade-in slide-in-from-bottom-5 z-50">
          
          <div className={`p-4 flex items-center justify-between text-white shadow-sm ${
            isAdminPage ? "bg-gradient-to-r from-gray-900 to-amber-800" : "bg-gradient-to-r from-pink-600 to-rose-500"
          }`}>
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold text-sm">
                  {isAdminPage ? "Soporte Administrador" : "Asistente Natt Store"}
                </h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span> Activo y listo
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/60 space-y-3">
            {currentView === "menu" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  {isAdminPage ? "Selecciona un módulo de gestión:" : "Selecciona un tema de interés:"}
                </p>
                {activeSections.map((sec) => {
                  const IconComp = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec)}
                      className={`w-full bg-white border p-3 rounded-xl flex items-center justify-between text-left transition-all shadow-xs group ${
                        isAdminPage ? "border-amber-100 hover:bg-amber-50/60" : "border-pink-100 hover:bg-pink-50/70"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isAdminPage 
                            ? "bg-amber-100 text-amber-700 group-hover:bg-amber-700 group-hover:text-white" 
                            : "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{sec.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-colors ${
                        isAdminPage ? "group-hover:text-amber-700" : "group-hover:text-pink-600"
                      }`} />
                    </button>
                  );
                })}

                {!isAdminPage && (
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl flex items-center justify-center space-x-2 text-sm font-medium transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Escribir por WhatsApp</span>
                  </button>
                )}
              </div>
            )}

            {currentView === "section" && selectedSection && (
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView("menu")}
                  className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                    isAdminPage ? "text-amber-700 hover:underline" : "text-pink-600 hover:underline"
                  }`}
                >
                  ← Volver a categorías
                </button>
                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">
                  {selectedSection.title}
                </h4>
                <div className="space-y-2 mt-2">
                  {selectedSection.questions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuestion(item.q, item.a)}
                      className={`w-full text-left text-xs bg-white p-3 rounded-xl border text-gray-700 font-medium transition-colors shadow-xs ${
                        isAdminPage ? "border-amber-100 hover:bg-amber-50" : "border-pink-100 hover:bg-pink-50"
                      }`}
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentView === "chat" && (
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView("menu")}
                  className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                    isAdminPage ? "text-amber-700 hover:underline" : "text-pink-600 hover:underline"
                  }`}
                >
                  ← Volver al menú principal
                </button>
                <div className="space-y-3">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-xl text-sm ${
                          msg.sender === "user"
                            ? isAdminPage ? "bg-amber-700 text-white rounded-br-none" : "bg-pink-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 shadow-xs border border-gray-100 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className={`p-3 bg-white border-t flex items-center justify-between ${
            isAdminPage ? "border-amber-100" : "border-pink-100"
          }`}>
            <span className="text-[11px] text-gray-400">
              {isAdminPage ? "Modo Administrador" : "Natt Store Asistente"}
            </span>
            <button
              onClick={handleWhatsAppRedirect}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg> WhatsApp
            </button>
          </div>

        </div>
      )}
    </div>
  );
}