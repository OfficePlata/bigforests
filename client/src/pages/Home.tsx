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
              BNI Big Forests
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 text-white/90 font-light">
              共に成長し、豊かな森を創る。<br/>
              信頼でつながるプロフェッショナルたちのコミュニティ。
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
              ビッグフォレスツチャプターは、皆を笑顔で迎え入れる温かな家のような場所です。
              メンバーひとりひとりが家族のように愛情を持って接しあい、活かしあいます。
              プロフェッショナリズムを追求しながらお互いをサポートして
              皆が開花できるようにこの理念を胸に日々を過ごします。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-[#F5F7F5] dark:bg-secondary/50">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">信頼できる仲間</h3>
              <p className="text-muted-foreground">
                HOME　〜愛と笑顔で開花する〜
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
              src="https://yjpw4ydvu698.jp.larksuite.com/share/base/view/shrjpacgCqCgQeqMjm2hV4hEN5e"
              className="w-full h-[800px] border-0"
              title="BNI Big Forests Members"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A4D2E] text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold font-serif mb-2">BNI Big Forests</h2>
              <p className="text-white/70 text-sm">
                定例会: 毎週水曜日 7:00 - 8:30<br/>
                会場: オンライン (Zoom)
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Instagram
              </a>
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
