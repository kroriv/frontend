import { json, redirect, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "投稿完了 | FUKUI BRAND FISH" },
    { name: "description", content: "福井の海で育まれた新鮮な魚介類「FUKUI BRAND FISH」をご紹介します。私たちが厳選した海の恵みを、豊富な種類と鮮度抜群でお届けします。福井の海の味をご家庭でお楽しみいただけるよう、品質にこだわった海産物を提供しています。" },
  ];
};

export default function Page() {

  return (
    <div className={ "bg-black" }>
      <div className={ "wrap flex justify-center items-center gap-16 min-h-[100vh]" }>
        <div className={ "text-white" }>
          <h2 className={ "text-24ptr font-semibold mb-4" }>投稿しました。</h2>
          <p>※注意点</p>
          <p>投稿内容は市場関係者による添削が完了次第、当サイトに反映されます。</p>
          <p>その為、リアルタイムには反映されない事を予めご了承願います。</p>
        </div>
        <Link to={ "/home" } className={ "button button--secondary" }>サイトトップに戻る</Link>
      </div>
    </div>
  );
}