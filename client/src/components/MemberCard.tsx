import { Member } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, Facebook, Globe, ShoppingBag } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none bg-white/80 dark:bg-card/80 backdrop-blur-sm group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={member.photo_url}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium text-sm">{member.category}</span>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{member.category}</p>
            <h3 className="text-xl font-bold font-serif">{member.name}</h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-3 min-h-[3.75rem]">
          {member.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-0">
        <div className="flex gap-2 w-full">
          {member.hp_url && (
            <Button variant="outline" size="sm" className="flex-1 h-9" asChild>
              <a href={member.hp_url} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Web
              </a>
            </Button>
          )}
          {member.product_url && (
            <Button variant="outline" size="sm" className="flex-1 h-9" asChild>
              <a href={member.product_url} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                商品
              </a>
            </Button>
          )}
        </div>
        
        <Button className="w-full bg-[#1877F2] hover:bg-[#1864D9] text-white border-none" asChild>
          <a href={member.facebook_url} target="_blank" rel="noopener noreferrer">
            <Facebook className="w-4 h-4 mr-2" />
            1to1を依頼する
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
