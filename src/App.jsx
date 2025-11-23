import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ShoppingCart, Search, Monitor, Menu, Settings, Zap, Brain, ShieldCheck, Truck, CreditCard, Trash2, Plus, Minus, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';

// --- CONFIGURACIÓN DEL CEREBRO ---
// Tu API Key personal de Google AI Studio
const API_KEY = 'AIzaSyAoUKvDdAPpOEhYK9ZTBt_aG279ogw9rf0'; 

// Usamos el modelo Flash por ser el más rápido y estable para este entorno web
const MODEL_ID = 'gemini-2.5-flash-preview-09-2025';

// --- DATASET: CATÁLOGO EXTENSO (MEMORIA DEL BOT) ---
const DATASET = [
  // --- LAPTOPS ---
  { id: 1, name: 'Laptop Pro X1', price: 4500, category: 'Laptops', image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', desc: 'Intel i7, 16GB RAM, SSD 512GB. Potencia pura para arquitectura y diseño.', originalPrice: 5000, rating: 4.8 },
  { id: 2, name: 'MacBook Air M2', price: 5200, category: 'Laptops', image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=800', desc: 'Chip M2, 8GB RAM. La mejor opción para oficina y movilidad.', originalPrice: 5500, rating: 4.9 },
  { id: 3, name: 'Gamer Legion 5', price: 4800, category: 'Laptops', image: 'https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'RTX 3060, Ryzen 7. Domina cualquier videojuego actual.', originalPrice: null, rating: 4.7 },
  { id: 101, name: 'Asus ROG Strix', price: 6500, category: 'Laptops', image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'RTX 4070, i9. Rendimiento extremo para streaming y gaming 4K.', rating: 5.0 },
  { id: 102, name: 'HP Pavilion 15', price: 2800, category: 'Laptops', image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Ryzen 5, 8GB RAM. Económica y confiable para estudiantes y tareas de oficina.', originalPrice: 3200, rating: 4.5 },
  { id: 103, name: 'Dell XPS 13', price: 5900, category: 'Laptops', image: 'https://images.pexels.com/photos/40185/macbook-pro-laptop-notebook-apple-40185.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Pantalla OLED 4K. Ultra delgada, perfecta para ejecutivos y viajes.', rating: 4.8 },
  { id: 104, name: 'Lenovo ThinkPad E14', price: 3100, category: 'Laptops', image: 'https://images.pexels.com/photos/3747266/pexels-photo-3747266.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Resistencia militar. El estándar de oro para el trabajo duro.', rating: 4.6 },
  { id: 105, name: 'Acer Swift 3', price: 2500, category: 'Laptops', image: 'https://images.pexels.com/photos/4061518/pexels-photo-4061518.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Ligera y rápida. Ideal para llevar a la universidad o café.', rating: 4.4 },

  // --- CELULARES ---
  { id: 4, name: 'Smartphone Z Ultra', price: 3200, category: 'Celulares', image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Cámara 108MP. Batería de larga duración para fotógrafos móviles.', originalPrice: 3800, rating: 4.6 },
  { id: 5, name: 'iPhone 15 Pro Max', price: 5600, category: 'Celulares', image: 'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Titanio, Chip A17 Pro. Lo máximo en potencia y estatus.', originalPrice: null, rating: 4.9 },
  { id: 6, name: 'Galaxy S24 Ultra', price: 5200, category: 'Celulares', image: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Con S-Pen y Zoom 100x. La herramienta definitiva de productividad.', originalPrice: 3900, rating: 4.9 },
  { id: 201, name: 'Xiaomi Redmi Note 13', price: 950, category: 'Celulares', image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Calidad precio imbatible. 108MP y pantalla AMOLED por poco dinero.', originalPrice: 1100, rating: 4.4 },
  { id: 202, name: 'iPhone 13', price: 2800, category: 'Celulares', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'El clásico confiable. Excelente cámara para redes sociales.', rating: 4.7 },
  { id: 203, name: 'Motorola Edge 40', price: 1600, category: 'Celulares', image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Diseño curvo elegante y carga ultra rápida.', rating: 4.5 },

  // --- AUDIO Y PERIFÉRICOS ---
  { id: 7, name: 'Sony WH-1000XM5', price: 1400, category: 'Audio', image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Cancelación de ruido líder. Aíslate del mundo para trabajar o viajar.', originalPrice: 1600, rating: 4.8 },
  { id: 8, name: 'Monitor LG UltraGear', price: 1400, category: 'Periféricos', image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800', desc: '27" 144Hz IPS. Colores vivos y velocidad para gaming competitivo.', rating: 4.6 },
  { id: 301, name: 'AirPods Pro 2', price: 1100, category: 'Audio', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Audio espacial. El compañero perfecto para tu iPhone.', rating: 4.9 },
  { id: 402, name: 'Teclado Keychron K2', price: 380, category: 'Periféricos', image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Mecánico Wireless. Táctil y compacto para programadores.', rating: 4.7 },
  { id: 405, name: 'Silla Gamer Corsair', price: 1200, category: 'Periféricos', image: 'https://images.pexels.com/photos/7858744/pexels-photo-7858744.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Ergonómica profesional. Cuida tu espalda en largas sesiones.', rating: 4.5 },
];

const formatPrice = (price) => `S/. ${price.toLocaleString('es-PE')}`;

// --- COMPONENTE HERO SLIDER ---
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: "Tecnologia del Futuro", subtitle: "Las mejores Laptops con procesadores de ultima generacion.", image: "https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?auto=compress&cs=tinysrgb&w=1920", color: "from-purple-900 to-blue-900" },
    { id: 2, title: "Ofertas Gaming", subtitle: "Equipate con RTX y pantallas de 144Hz al mejor precio.", image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1920", color: "from-red-900 to-orange-900" },
    { id: 3, title: "Audio Inmersivo", subtitle: "Vive el sonido con cancelacion de ruido activa.", image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1920", color: "from-blue-900 to-cyan-900" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80 mix-blend-multiply`}></div>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up drop-shadow-lg">{slide.title}</h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-8 font-light opacity-90 animate-fade-in-up delay-100 drop-shadow-md">{slide.subtitle}</p>
            <button onClick={() => document.getElementById('ofertas').scrollIntoView({behavior: 'smooth'})} className="w-fit bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg animate-fade-in-up delay-200">Ver Catalogo</button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2'}`} />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRODUCT CAROUSEL ---
const ProductCarouselRow = ({ title, products, onAdd, id }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div id={id} className="py-10 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-end">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          {title.includes('Oferta') && <Zap className="text-yellow-500 fill-yellow-500 animate-pulse" size={28} />}
          {title}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-200 hover:bg-purple-50 hover:border-purple-200 text-gray-600 transition-colors shadow-sm"><ChevronLeft size={20}/></button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-200 hover:bg-purple-50 hover:border-purple-200 text-gray-600 transition-colors shadow-sm"><ChevronRight size={20}/></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex overflow-x-auto gap-6 px-4 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0" style={{ scrollBehavior: 'smooth', scrollPaddingLeft: '1rem' }}>
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start">
            <ProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TARJETA DE PRODUCTO ---
const ProductCard = ({ product, onAdd }) => (
  <div className="bg-white h-full rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col shadow-sm">
    <div className="h-56 overflow-hidden relative bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
        )}
        <button onClick={() => onAdd(product)} className="absolute bottom-3 right-3 bg-white p-3 rounded-full shadow-lg text-purple-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-purple-600 hover:text-white"><Plus size={20} /></button>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase tracking-wider text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">{product.category}</span>
        <div className="flex items-center text-yellow-400 text-xs font-bold gap-1 bg-yellow-50 px-2 py-0.5 rounded-full"><Star size={12} fill="currentColor" /> {product.rating}</div>
      </div>
      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-purple-700 transition-colors">{product.name}</h3>
      <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{product.desc}</p>
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
        <div className="flex flex-col">
            {product.originalPrice && <span className="text-xs text-gray-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>}
            <span className="text-xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
        </div>
        <button onClick={() => onAdd(product)} className="text-xs font-bold text-purple-600 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors">Agregar</button>
      </div>
    </div>
  </div>
);

// --- CHATBOT INTELIGENTE (CONECTADO A GEMINI API) ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola. Soy InnoBot. Buscas algo para jugar o para trabajar? Preguntame lo que sea.", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  // --- LLAMADA A API REAL DE GOOGLE GEMINI ---
  const callGeminiAPI = async (userText) => {
    try {
        // Modelo: Flash Preview para compatibilidad
        const model = MODEL_ID; 
        
        const context = `
        Eres InnoBot, un asistente de ventas experto para la tienda 'InnovVentas'.
        Tu objetivo es ayudar a los clientes a encontrar el producto ideal de nuestro catálogo y responder dudas.
        
        REGLAS DE COMPORTAMIENTO:
        1. Tienes acceso al siguiente CATÁLOGO de productos en formato JSON: ${JSON.stringify(DATASET.map(p => ({id: p.id, nombre: p.name, precio: p.price, categoria: p.category, descripcion: p.desc})))}.
        2. Responde SIEMPRE en español y de forma amable y concisa.
        3. NO uses emojis en tus respuestas.
        4. Cuando recomiendes un producto, menciona su nombre exacto y su precio en Soles (S/.).
        5. Si te preguntan por algo que no está en el catálogo, di que no tenemos stock de eso por el momento pero ofrece una alternativa similar del catálogo.
        6. Si el usuario dice "trabajar", busca laptops con palabras clave como 'oficina', 'diseño', 'arquitectura', 'negocios'.
        7. Si el usuario dice "jugar" o "gamer", busca laptops con 'RTX', 'Gamer', 'Ryzen'.
        8. La tienda física está en Av. Tecnología 123, Lima. Envíos gratis a partir de S/. 1500.
        
        Pregunta del usuario: "${userText}"
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: context }]
                }]
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error("Error Gemini:", data.error);
            return "Lo siento, tuve un problema al consultar mi cerebro. ¿Podrías intentar de nuevo?";
        }
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No encontré una respuesta.";

    } catch (error) {
        console.error("Error de red:", error);
        return "Error de conexión. Por favor verifica tu internet.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Llamada a la IA
    const reply = await callGeminiAPI(userMsg.text);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
    setIsTyping(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-purple-600 hover:scale-110 hover:bg-purple-700'} text-white`}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[500px] animate-fade-in-up overflow-hidden">
          <div className="bg-gray-900 p-4 text-white flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center animate-pulse"><Brain size={20}/></div>
            <div><h3 className="font-bold">InnoBot AI</h3><p className="text-xs opacity-70">En linea ahora</p></div>
            <button onClick={() => setIsOpen(false)} className="ml-auto hover:text-gray-300 p-1 rounded-md hover:bg-white/10 transition-colors"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                  <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-gray-400 ml-4">InnoBot está pensando...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex gap-2 items-center">
            <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Escribe aqui..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"/>
            <button type="submit" className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-transform hover:scale-105 shadow-md"><Send size={18}/></button>
          </form>
        </div>
      )}
    </>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showSearch, setShowSearch] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const filteredProducts = DATASET
    .filter(p => activeCategory === 'Todos' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-16">
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg shadow-sm z-40 transition-all duration-300 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <div className="bg-purple-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform"><Monitor size={24} /></div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">Innov<span className="text-purple-600">Ventas</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-gray-600 font-medium text-sm uppercase tracking-wide">
              <button onClick={() => scrollToSection('catalogo')} className="hover:text-purple-600 transition-colors hover:bg-purple-50 px-3 py-1 rounded-md">Catalogo</button>
              <button onClick={() => scrollToSection('ofertas')} className="hover:text-purple-600 transition-colors hover:bg-purple-50 px-3 py-1 rounded-md">Ofertas</button>
              <button onClick={() => scrollToSection('soporte')} className="hover:text-purple-600 transition-colors hover:bg-purple-50 px-3 py-1 rounded-md">Soporte</button>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center transition-all duration-300 ${showSearch ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                <input type="text" placeholder="Buscar..." className="w-full bg-gray-100 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if(e.target.value) scrollToSection('catalogo'); }} />
              </div>
              <button onClick={() => setShowSearch(!showSearch)} className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-full transition-colors"><Search size={20} /></button>
              <button onClick={() => setIsCartOpen(true)} className="relative text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-full transition-colors group">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {cart.length > 0 && <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
              </button>
              <Menu className="md:hidden text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b flex justify-between items-center bg-white"><h2 className="font-bold text-xl text-gray-800">Tu Carrito ({cart.length})</h2><button onClick={() => setIsCartOpen(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20}/></button></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div><h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</h4><p className="text-purple-600 font-bold text-sm">{formatPrice(item.price)}</p></div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-200 rounded-l-lg"><Minus size={12}/></button>
                        <span className="text-xs font-bold px-2 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-200 rounded-r-lg"><Plus size={12}/></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="p-6 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"><div className="flex justify-between items-center mb-4"><span className="text-gray-600 font-medium">Total a pagar</span><span className="text-2xl font-extrabold text-gray-900">{formatPrice(cartTotal)}</span></div><button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex justify-center items-center gap-2"><CreditCard size={20} /> Procesar Compra</button></div>}
          </div>
        </div>
      )}

      <HeroCarousel />

      {DATASET.length > 0 && (
        <>
          <section id="ofertas" className="bg-white pt-8">
            <ProductCarouselRow title="Ofertas Relampago" products={DATASET.filter(p => p.originalPrice)} onAdd={addToCart} />
          </section>
          <section className="bg-white">
            <ProductCarouselRow title="Laptops Mas Vendidas" products={DATASET.filter(p => p.category === 'Laptops')} onAdd={addToCart} />
          </section>
          <section className="bg-white">
            <ProductCarouselRow title="Moviles en Tendencia" products={DATASET.filter(p => p.category === 'Celulares')} onAdd={addToCart} />
          </section>
        </>
      )}

      <section id="catalogo" className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><Filter size={24} className="text-purple-600" /> Explorar Todo</h2>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Laptops', 'Celulares', 'Audio', 'Periféricos'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-gray-900 text-white shadow-lg transform scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}>{cat}</button>
              ))}
            </div>
          </div>
          {filteredProducts.length > 0 ? (
             <ProductCarouselRow title={activeCategory === 'Todos' ? 'Resultados de Busqueda' : `Catalogo de ${activeCategory}`} products={filteredProducts} onAdd={addToCart} />
          ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed"><Search size={64} className="mx-auto text-gray-300 mb-4"/><p className="text-gray-500 text-lg">No encontramos resultados.</p></div>
          )}
        </div>
      </section>

      <footer id="soporte" className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div><h4 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><Monitor className="text-purple-500" /> InnovVentas</h4><p className="text-sm leading-relaxed mb-4">Lideres en tecnologia con soporte IA. Envios a todo el Peru con garantia real.</p></div>
            <div><h4 className="text-white font-bold mb-6">Comprar</h4><ul className="space-y-3 text-sm"><li>Laptops Gamer</li><li>Smartphones</li><li>Ofertas</li></ul></div>
            <div><h4 className="text-white font-bold mb-6">Soporte</h4><ul className="space-y-3 text-sm"><li>Estado de mi pedido</li><li>Garantias</li></ul></div>
            <div><h4 className="text-white font-bold mb-6">Contactanos</h4><p className="text-sm mb-2 flex items-center gap-2"><Settings size={16}/> soporte@innovventas.pe</p></div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;