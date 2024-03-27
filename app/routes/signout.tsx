import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { getSession, commitSession, destroySession } from "~/services/session.server";

/**
 * Meta
 */
export const meta: MetaFunction = () => {
  return [
    { title: "FUKUI BRAND FISH | サインアウト" },
    { name: "description", content: "福井の海で育まれた新鮮な魚介類「FUKUI BRAND FISH」をご紹介します。私たちが厳選した海の恵みを、豊富な種類と鮮度抜群でお届けします。福井の海の味をご家庭でお楽しみいただけるよう、品質にこだわった海産物を提供しています。" },
  ];
};

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  
  // セッションに認証署名を取得
  const signature = session.get("signin-auth-user-signature");
  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(signature));
  
  return json({
  }, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Page() {
  // Navigate
  const navigate = useNavigate();
  // Effects
  useEffect(() => {
    // 3秒後にトップページへ遷移
    const timeoutId = setTimeout(() => {
      navigate("/signup");
    }, 3000)
    // クリーンアップ
    return () => {
      clearTimeout(timeoutId)
    }
  }, []);
  
  return (
    <article className={ "container" }>
      <div className={ "wrap" }>
        <h1 className={ "text-30ptr font-semibold" }>サインアウトしました</h1>
        <p>3秒後にトップページへ移動します。</p>
      </div>
    </article>
  );
}
