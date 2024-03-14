import type { LoaderFunctionArgs, MetaFunction  } from "@remix-run/cloudflare";
import { json, useLoaderData, Link, LinkProps } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import Logo from "~/components/shared/Logo"; 
import ThumbPost from "~/components/shared/ThumbPost";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));
  // 認証処理から認証署名を取得
  const { user, likes, comments } = await guard({ request: request, context: context });
  // 利用者情報をセッションに保存
  if (user) {
    //session.set("signin-auth-user", user);
  }
  // いいねリストをセッションに保存
  if (likes.length > 0) {
    session.set("home-user-like", likes);
  }
  // コメントリストをセッションに保存
  if (comments.length > 0) {
    session.set("home-user-comment", comments);
  }
  
  return json({
    user, likes, comments, uploads_url: context.env.UPLOADS_URL,
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { uploads_url } = loaderData;
  
  return (
    <>
      <section className={ "container" }>
        <div className={ "wrap" }>
          <Logo/>
        </div>
      </section>
      <section className={ "container mb-12" }>
        <div className={ "wrap grid grid-cols-2 gap-1 md:gap-4" }>
          <Link to={ "/home/pickup?ref=1" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-28ptr md:text-40ptr font-semibold drop-shadow-sm" }>ふくいサーモン</span>
          </Link>
          <Link to={ "/home/pickup?ref=2" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-28ptr md:text-40ptr font-semibold drop-shadow-sm" }>若狭ふぐ</span>
          </Link>
          <Link to={ "/home/pickup?ref=3" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-28ptr md:text-40ptr font-semibold drop-shadow-sm" }>敦賀真鯛</span>
          </Link>
          <Link to={ "/home/pickup?ref=4" } className={ "group block relative cursor-pointer" }>
            <figure className={ "block relative w-full pt-[110.0%] md:pt-[50.0%] bg-black" }>
              <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
            </figure>
            <span className={ "absolute inset-0 m-auto flex justify-center items-center text-white text-28ptr md:text-40ptr font-semibold drop-shadow-sm" }>若狭まはた</span>
          </Link>
        </div>
        
      </section>
      <section className={ "container" }>
        <div className={ "wrap flex justify-between md:justify-start items-baseline gap-4 mb-8" }>
          <h2 className={ "text-28ptr font-semibold" }>トピックス</h2>
          <Link to={ "" } className={ "text-[#003371]" }>すべて見る</Link>{/* 挙動不明 */}
        </div>
        {/* 区分なし最新記事20件ほどAPIから取得してください */}
        <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
          <ThumbPost to={ "" } title={ "記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！" } uploadsUrl={ uploads_url }/>
          <ThumbPost to={ "" } title={ "記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！" } uploadsUrl={ uploads_url }/>
          <ThumbPost to={ "" } title={ "記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！" } uploadsUrl={ uploads_url }/>
          <ThumbPost to={ "" } title={ "記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！" } uploadsUrl={ uploads_url }/>
          <ThumbPost to={ "" } title={ "記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！記事タイトルが入ります！" } uploadsUrl={ uploads_url }/>
        </div>
      </section>
    </>
  );
}