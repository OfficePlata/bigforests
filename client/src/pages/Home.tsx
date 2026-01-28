import { ArrowRight, Globe, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] dark:bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-forest.jpg" 
            alt="Big Forests Chapter" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container relative z-10 text-center text-white px-4">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 tracking-tight">
              BNI ビッグフォレスツ
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 text-white/90 font-light">
              HOME<br/>
              〜愛と笑顔で開花する〜
            </p>
            <Button size="lg" className="bg-[#F9CF64] text-[#1A4D2E] hover:bg-[#F9CF64]/90 font-bold text-lg px-8 rounded-full border-none" onClick={() => {
              document.getElementById('members-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              メンバーを探す <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <img src="/images/pattern-leaf.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-6">
              チャプターについて
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ビッグフォレスツチャプターは、皆を笑顔で迎え入れる温かな家のような場所です。 <br/>
              メンバーひとりひとりが家族のように愛情を持って接しあい、活かしあいます。 <br/>
              プロフェッショナリズムを追求しながらお互いをサポートして<br/>
              皆が開花できるようにこの理念を胸に日々を過ごします。<br/>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-[#F5F7F5] dark:bg-secondary/50">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">信頼できる仲間</h3>
              <p className="text-muted-foreground">
                信頼でつながるプロフェッショナルたちのコミュニティ。
                安心してビジネスを任せられる仲間です。
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F5F7F5] dark:bg-secondary/50">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">広がるネットワーク</h3>
              <p className="text-muted-foreground">
                チャプター内だけでなく、全国・世界中のBNIメンバーと
                つながる機会があります。
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F5F7F5] dark:bg-secondary/50">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">ビジネスの成長</h3>
              <p className="text-muted-foreground">
                質の高いリファーラル（紹介）の交換により、
                効率的かつ継続的なビジネス拡大を実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section (Lark Embed) */}
      <section id="members-section" className="py-20 bg-[#F5F7F5] dark:bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4">
              メンバー紹介
            </h2>
            <p className="text-muted-foreground">
              各分野のプロフェッショナルをご紹介します
            </p>
          </div>
          
          <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <iframe 
              src="https://yjpw4ydvu698.jp.larksuite.com/share/base/dashboard/shrjphE3Ft8FpMPZxJZ8tiEgVOb"
              className="w-full h-[800px] border-0"
              title="BNI Big Forests Members"
              allow="clipboard-read; clipboard-write; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-modals"
            />
          </div>
        </div>
      </section>

{/* Padlet Slideshow Section */}
      <section className="py-16 bg-white dark:bg-card border-t border-border/50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4">
              ギャラリー
            </h2>
            <p className="text-muted-foreground">
              メンバーの活動内容をご覧ください
            </p>
          </div>
          
          {/* レスポンシブ対応コンテナ */}
          <div className="flex justify-center w-full">
            <div 
              className="padlet-slideshow-embed w-full max-w-[720px] shadow-xl rounded-lg overflow-hidden bg-muted"
              style={{ aspectRatio: '3/2' }}
            >
              <p style={{ padding: 0, margin: 0, width: '100%', height: '100%' }}>
                <iframe 
                  src="https://padlet.com/embed/8t2q3e0nwpzaksy0/slideshow?autoplay=1&loop=1&duration=auto" 
                  frameBorder="0" 
                  allow="clipboard-write" 
                  className="w-full h-full block"
                  style={{ display: 'block', padding: 0, margin: 0 }}
                  title="Activity Gallery"
                ></iframe>
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#1A4D2E] text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold font-serif mb-2">BNI ビッグフォレスツ</h2>
              <p className="text-white/70 text-sm">
                定例会: 毎週水曜日 7:00 - 8:30<br/>
                会場: オンライン (Zoom)
              </p>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://yjpw4ydvu698.jp.larksuite.com/share/base/form/shrjpZbC0f1F1QhJF6iWGb4GDne" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                例会申込はこちら
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            &copy; {new Date().getFullYear()} BNI Big Forests Chapter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
