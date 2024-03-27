import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import guard from "~/services/guard.user.server";
import Splash from "~/components/Splash";

export const meta: MetaFunction = () => {
  return [
    { title: "FUKUI BRAND FISH" },
    { name: "description", content: "福井の海で育まれた新鮮な魚介類「FUKUI BRAND FISH」をご紹介します。私たちが厳選した海の恵みを、豊富な種類と鮮度抜群でお届けします。福井の海の味をご家庭でお楽しみいただけるよう、品質にこだわった海産物を提供しています。" },
  ];
};

/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    // 認証処理から利用者を取得
    const { user, likes, comments } = await guard({ request: request, context: context });
    
    if (user) {
      return json ({ user: user, error: null });
    } else {
      return json ({ user: user, error: "error" });
    }
  } catch (error) {
    //return redirect("/signup");
    return json({ user: null, error: error }, { status: 401 });
  }
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { user, error } = loaderData;
  
  // Navigate
  const navigate = useNavigate();
  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(!error ? "/home" : "/signup", { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={ "flex justify-center flex-col items-center h-screen" }>
      <Splash/>
    </div>
  );
}
