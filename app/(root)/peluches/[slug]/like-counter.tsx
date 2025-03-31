"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { incrementProductLikes } from "@/lib/actions/product";
import { Slug } from "@/sanity/types";

interface LikeCounterProps {
  initialLikes?: number;
  slug?: Slug;
}

export function LikeCounter({ initialLikes = 0, slug }: LikeCounterProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Revisar si está bloqueado por límite
  useEffect(() => {
    const storedBlockTime = localStorage.getItem("likeBlockTime");
    if (storedBlockTime) {
      const blockTime = new Date(storedBlockTime).getTime();
      const currentTime = Date.now();
      if (currentTime < blockTime) {
        setIsBlocked(true);
        const timeout = setTimeout(() => {
          setIsBlocked(false);
          localStorage.removeItem("likeBlockTime");
        }, blockTime - currentTime);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const handleLike = async () => {
    if (isBlocked) {
      toast.error("Has alcanzado el límite de likes. Intenta de nuevo en 1 hora.");
      return;
    }

    if (hasLiked) {
      toast("Ya has dado like a este producto.");
      return;
    }

    if (likeCount >= 10) {
      setIsBlocked(true);
      const blockTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      localStorage.setItem("likeBlockTime", blockTime.toISOString());
      toast.error("Has alcanzado el límite de likes. Intenta de nuevo en 1 hora.");
      return;
    }

    const previousLikes = likes;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    setLikeCount((prev) => prev + 1);

    try {
      if (slug?.current) {
        await incrementProductLikes(slug.current);
        toast.success("¡Like agregado!", {
          description: "Has indicado que te gusta este producto.",
        });
      } else {
        throw new Error("Slug inválido.");
      }
    } catch (error) {
      console.error("Error dando like:", error);
      toast.error("No se pudo dar like. Intenta más tarde.");
      setLikes(previousLikes);
      setHasLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="flex items-center gap-2 transition-color">
      <button
        onClick={handleLike}
        className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full transition-color group"
        disabled={isBlocked || hasLiked}
      >
        <Heart
          className={`w-5 h-5 transition-color group-hover:stroke-red-400 ${
            hasLiked ? "fill-red-400 stroke-red-400" : "stroke-gray-500"
          }`}
        />
      </button>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <GetLikesText likes={likes} userLiked={hasLiked} />
      </div>
    </div>
  );
}

function GetLikesText({ likes, userLiked }: { likes: number; userLiked: boolean }) {
  if (likes === 0 || likes === null) return <div>Sé el primero en dar like</div>;

  if (likes === 1) {
    return userLiked ? (
      <div>A ti te gusta esto</div>
    ) : (
      <div>A {likes} persona le gusta esto</div>
    );
  }

  return userLiked ? (
    <div>
      A ti y a {likes - 1} {likes - 1 === 1 ? "persona" : "personas"} más les gusta esto
    </div>
  ) : (
    <div>A {likes} personas les gusta esto</div>
  );
}
