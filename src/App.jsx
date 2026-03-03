import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Cpu, 
  Zap, 
  Clock, 
  Users, 
  Search, 
  MessageSquare, 
  Glasses, 
  Phone, 
  Mail, 
  ArrowRight, 
  Monitor,
  Code,
  Copy,
  Check,
  Send
} from 'lucide-react';

// --- 全局配置 ---
const THEME_COLOR = '#A8EE48'; // 新的荧光绿

// --- 工具函数 ---
const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) resolve();
      else reject(new Error('Copy command failed'));
    } catch (err) {
      console.error('Copy failed', err);
      reject(err);
    }
  });
};

// --- 组件：ShineText ---
const ShineText = ({ text, className = "", finalStyle = { color: '#ffffff' } }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'animating' | 'finished'
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && status === 'idle') {
          setStatus('animating');
          observer.disconnect();
        }
      },
      { threshold: 0.2 } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [status]);

  return (
    <span 
      ref={elementRef}
      className={`relative inline-block ${className}`}
    >
      <span style={{ ...finalStyle, display: 'inline-block', position: 'relative', zIndex: 1 }}>
        {text}
      </span>
      {status === 'animating' && (
        <span 
          className="absolute inset-0 animate-shine-once"
          onAnimationEnd={() => setStatus('finished')}
          style={{
            zIndex: 2,
            backgroundImage: `linear-gradient(110deg, 
              transparent 35%, 
              #3b82f6 43%, 
              #d946ef 47%, 
              #ffffff 50%, 
              #d946ef 53%, 
              #3b82f6 57%, 
              transparent 65%
            )`,
            backgroundSize: '300% 100%',
            backgroundRepeat: 'no-repeat',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            pointerEvents: 'none'
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

// --- 组件部分 ---

// 1. 导航栏
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-2' 
        : 'bg-transparent border-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Logo 图片 */}
            <img 
              src="https://yuandong-experiment.oss-cn-beijing.aliyuncs.com/Slice6%201.png" 
              alt="Log Design Logo" 
              className="w-8 h-8 object-contain"
            />
            {/* 应用 font-montserrat 类，字体加粗 */}
            <span className="text-white text-xl tracking-wider font-montserrat font-bold">Log Design</span>
          </div>
          <div className="hidden md:block">
            <button 
              onClick={scrollToContact}
              className="px-8 py-2.5 font-bold tracking-wide uppercase text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(168,238,72,0.4)]"
              style={{ backgroundColor: THEME_COLOR, color: 'black' }}
            >
              联系我们
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <button 
              onClick={scrollToContact}
              className="w-full mt-4 px-6 py-3 font-bold rounded-full transition-colors"
              style={{ backgroundColor: THEME_COLOR, color: 'black' }}
            >
              联系我们
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Hero Section
const Hero = () => {
  const phrases = ["用设计为企业提供价值", "用专业能力重塑数字体验"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const handleTyping = () => {
      setDisplayText(prev => isDeleting ? currentPhrase.substring(0, prev.length - 1) : currentPhrase.substring(0, prev.length + 1));
      let nextSpeed = isDeleting ? 75 : 150;
      if (!isDeleting && displayText === currentPhrase) {
        nextSpeed = 3000;
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        nextSpeed = 500;
      }
      setTypingSpeed(nextSpeed);
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhraseIndex, phrases, typingSpeed]);

  return (
    <div className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-20px, 20px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes color-cycle {
          0%, 100% { background-color: rgba(168, 238, 72, 0.2); } 
          25% { background-color: rgba(37, 99, 235, 0.2); } 
          50% { background-color: rgba(147, 51, 234, 0.2); } 
          75% { background-color: rgba(13, 148, 136, 0.2); } 
        }
        @keyframes shine-once {
          0% { background-position: 100% 0; }
          100% { background-position: 0% 0; } 
        }
        .animate-blob { animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-color { animation: color-cycle 20s infinite linear; }
        .animate-shine-once {
          animation: shine-once 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      <div className="absolute inset-0 z-0 opacity-30" 
           style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animate-color"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animate-color animation-delay-2000"></div>
         <div className="absolute -bottom-32 -left-20 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animate-color animation-delay-4000"></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full mix-blend-screen filter blur-[120px] animate-pulse animate-color animation-delay-2000"></div>
      </div>
      <div className="relative z-10 px-4 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 h-[1.2em] flex items-center justify-center drop-shadow-2xl">
            <span className="relative z-10">{displayText}</span>
            <span className="inline-block w-1 md:w-2 h-8 md:h-12 ml-1 animate-pulse align-middle" style={{ backgroundColor: THEME_COLOR, boxShadow: `0 0 10px rgba(168, 238, 72, 0.8)` }}></span>
          </h1>
        </div>
      </div>
    </div>
  );
};

// 3. 价值宣导模块
const values = [
  { icon: <Cpu size={32} />, title: "绝对专业", desc: "来自一线大厂提供专业设计开发服务，对设计方法、专业技能、审美趋势有绝对优势" },
  { icon: <Zap size={32} />, title: "绝对性价比", desc: "致力于打造小而美的精品品牌，成员水准有严格要求，项目价格有绝对优势" },
  { icon: <Clock size={32} />, title: "绝对服务", desc: "固定人力资源池，轮班制实现全周7天、早9晚10服务方案，解决客户急、难、晚等难题" },
  { icon: <Users size={32} />, title: "绝对共赢", desc: "我们不仅仅是客户的手，还在产品设计上提供建议及咨询，探讨产品策略，提供完整解决方案" }
];

const ValueSection = () => {
  return (
    <section className="py-24 bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white inline-block relative">
            元动的
            <span className="relative inline-block ml-3">
              <ShineText text="四个绝对" finalStyle={{ color: THEME_COLOR }} />
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, index) => (
            <div key={index} className="group p-8 border border-white/10 bg-zinc-900/50 hover:border-[#A8EE48]/50 transition-all duration-300 hover:-translate-y-2 rounded-sm backdrop-blur-sm">
              <div className="mb-6" style={{ color: THEME_COLOR }}>{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. 团队能力介绍
const capabilities = [
  { icon: <Monitor size={32} />, name: "产品设计与开发" }, 
  { icon: <Search size={32} />, name: "用户调研" },
  { icon: <MessageSquare size={32} />, name: "产品咨询" },
  { icon: <Glasses size={32} />, name: "虚拟仿真设计与开发" }
];

const CapabilitiesSection = () => {
  return (
    <section className="py-24 bg-zinc-950 border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            我们提供多领域
            <br className="md:hidden" />
            <span className="md:ml-3">
              <ShineText 
                text="全方位解决方案" 
                finalStyle={{
                  backgroundImage: `linear-gradient(to right, ${THEME_COLOR}, #3b82f6)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              />
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {capabilities.map((cap, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-6 md:p-10 h-80 md:h-96 w-full max-w-[240px] mx-auto bg-black border border-white/10 hover:border-[#A8EE48] transition-colors duration-300 group rounded-sm">
              <div className="p-4 md:p-5 bg-zinc-900 rounded-full mb-6 md:mb-8 text-white group-hover:bg-[#A8EE48] group-hover:text-black transition-colors duration-300">
                {cap.icon}
              </div>
              <h3 className="text-lg md:text-xl font-medium text-white text-center px-2">{cap.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. 客户案例
const cases = [
  { logo: <Code size={20} />, title: "未来金融 Dashboard", client: "FinTech Corp", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { logo: <Monitor size={20} />, title: "智能物流管理系统", client: "LogiTech", image: "https://images.unsplash.com/photo-1555421689-d68471e18963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { logo: <Zap size={20} />, title: "VR 工业仿真平台", client: "MechIndustry", image: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
];

const CaseSection = () => {
  return (
    <section className="py-24 bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            设计赋能
            <span className="ml-3">
              <ShineText text="客户增长" finalStyle={{ color: THEME_COLOR }} />
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4">我们与行业领袖合作，打造具有影响力的数字产品。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/3] bg-zinc-900 mb-6 border border-white/5">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="font-medium" style={{ color: THEME_COLOR }}>View Project</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2" style={{ color: THEME_COLOR }}>
                {item.logo}
                <span className="text-xs uppercase tracking-wider font-bold">{item.client}</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#A8EE48] transition-colors">{item.title}</h3>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 hover:text-white transition-colors mt-12 mx-auto" style={{ color: THEME_COLOR }}>
            查看更多案例 <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

// 6. 联系我们 & Footer
const Footer = () => {
  const [copiedField, setCopiedField] = useState(null);
  const handleCopy = (text, fieldName) => {
    copyToClipboard(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };
  const handleEmail = () => { window.location.href = "mailto:skyer@yuandongsj.cn"; };

  return (
    <footer id="contact" className="bg-zinc-950 border-t border-white/10 pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
             <ShineText text="准备好开始您的项目了吗？" finalStyle={{ color: THEME_COLOR }} />
           </h2>
           <p className="text-gray-400 mb-8 max-w-2xl mx-auto">立即联系我们，获取专业的咨询建议与解决方案。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
             {/* 电话 */}
             <div onClick={() => handleCopy("18511841106", "phone")} className="flex flex-col items-center justify-center p-8 border border-white/10 rounded hover:border-[#A8EE48] transition-colors bg-black group cursor-pointer overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-[#A8EE48] group-hover:!text-black transition-all duration-300" style={{ color: THEME_COLOR }}> <Phone size={24} /> </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">致电我们</div>
                <div className="flex items-center justify-center">
                   <div className="text-white font-bold text-xl">18511841106</div>
                   <div className="w-0 group-hover:w-8 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center">
                      <div className="pl-2 text-gray-500 hover:text-[#A8EE48]" style={{ color: copiedField === 'phone' ? THEME_COLOR : undefined }}>
                        {copiedField === 'phone' ? <Check size={18} /> : <Copy size={18} />}
                      </div>
                   </div>
                </div>
                {copiedField === 'phone' && <span className="text-xs text-green-500 font-medium animate-pulse mt-1">已复制</span>}
             </div>
             
             {/* 微信 */}
             <div onClick={() => handleCopy("skyer1106", "wechat")} className="flex flex-col items-center justify-center p-8 border border-white/10 rounded hover:border-[#A8EE48] transition-colors bg-black group cursor-pointer overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-[#A8EE48] group-hover:!text-black transition-all duration-300" style={{ color: THEME_COLOR }}> <MessageSquare size={24} /> </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">微信咨询</div>
                <div className="flex items-center justify-center">
                   <div className="text-white font-bold text-xl">skyer1106</div>
                   <div className="w-0 group-hover:w-8 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center">
                      <div className="pl-2 text-gray-500 hover:text-[#A8EE48]" style={{ color: copiedField === 'wechat' ? THEME_COLOR : undefined }}>
                        {copiedField === 'wechat' ? <Check size={18} /> : <Copy size={18} />}
                      </div>
                   </div>
                </div>
                {copiedField === 'wechat' && <span className="text-xs text-green-500 font-medium animate-pulse mt-1">已复制</span>}
             </div>
             
             {/* 邮件 */}
             <div onClick={handleEmail} className="flex flex-col items-center justify-center p-8 border border-white/10 rounded hover:border-[#A8EE48] transition-colors bg-black group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-[#A8EE48] group-hover:!text-black transition-all duration-300" style={{ color: THEME_COLOR }}> <Mail size={24} /> </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">发送邮件</div>
                <div className="flex items-center justify-center">
                  <div className="text-white font-bold text-xl">skyer@yuandongsj.cn</div>
                  <div className="w-0 group-hover:w-8 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center">
                     <div className="pl-2 text-gray-500 hover:text-[#A8EE48]"> <Send size={18} /> </div>
                  </div>
                </div>
             </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-sm" style={{ backgroundColor: THEME_COLOR }}>
              <span className="text-black font-bold text-xs">L</span>
            </div>
            <span className="text-gray-400 font-bold text-lg">Log Design</span>
          </div>
          <p className="text-gray-600 text-sm">© 2024 Log Design Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Layout
const App = () => {
  return (
    <div className="font-sans antialiased bg-black text-slate-200 selection:bg-[#A8EE48] selection:text-black">
      {/* 确保字体在全局范围内加载 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
      <Navbar />
      <Hero />
      <ValueSection />
      <CapabilitiesSection />
      <CaseSection />
      <Footer />
    </div>
  );
};

export default App;