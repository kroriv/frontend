import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "お問い合わせ | FUKUI BRAND FISH" },
    { name: "description", content: "福井の海で育まれた新鮮な魚介類「FUKUI BRAND FISH」をご紹介します。私たちが厳選した海の恵みを、豊富な種類と鮮度抜群でお届けします。福井の海の味をご家庭でお楽しみいただけるよう、品質にこだわった海産物を提供しています。" },
  ];
};

export default function Page() {

  return (
    <div className={ "bg-black" }>
      <div className={ "wrap flex justify-center items-center gap-16 min-h-[100vh]" }>
        <div className={ "text-white" }>
          <h2 className={ "text-24ptr font-semibold mb-4" }>問い合わせしました。</h2>
          <p>市場に問い合わせしました。</p>
          <p>市場から折り返しの連絡をお待ちください。</p>
        </div>
        <Link to={ "/home" } className={ "button button--secondary" }>サイトトップに戻る</Link>
      </div>
    </div>
  );
}