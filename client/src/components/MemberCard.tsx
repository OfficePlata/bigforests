import { Member } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Globe, UserRound } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none bg-white dark:bg-card group">
      {/* 写真エリア */}
      <div className="relative h-52 overflow-hidden bg-[#F5F7F5]">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserRound className="w-20 h-20 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="pb-1 pt-4">
        <p className="text-xs text-primary font-medium tracking-wide uppercase line-clamp-1">
          {member.category}
        </p>
        <h3 className="text-lg font-bold font-serif leading-tight">{member.name}</h3>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {member.category}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0 pb-4">
        <div className="flex gap-2 w-full">
          {member.hp_url && (
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" asChild>
              <a href={member.hp_url} target="_blank" rel="noopener noreferrer">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                ホームページ
              </a>
            </Button>
          )}
        </div>

        {member.facebook_url && (
          <Button
            className="w-full bg-[#1A4D2E] hover:bg-[#1A4D2E]/90 text-white border-none h-9 text-sm"
            asChild
          >
            <a href={member.facebook_url} target="_blank" rel="noopener noreferrer">
              1to1を依頼する
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
