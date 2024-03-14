import type { LoaderFunctionArgs, MetaFunction , ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import guard from "~/services/guard.user.server";
import { reportcostom as ReportCostom } from "~/types/Report";
import { topic as topic } from "~/types/topic";
import Logo from "~/components/shared/Logo"; 
import ThumbPost from "~/components/shared/ThumbPost";

export const meta: MetaFunction = () => {
  return [
    { title: "会員トップページ | FUKUI BRAND FISH" },
    { name: "description", content: "FUKUI BRAND FISHへようこそ" },
  ];
};

type LoaderApiResponse = {
    status: number;
    messages: { message: string };
    MarketReports: ReportCostom[];
    FishmanReports: ReportCostom[];
    topics: topic[];
}

  
/**
 * Loader
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  console.log("======pickup._index  LOADER======");

  // セッション取得
  const session = await getSession(request.headers.get("Cookie"));

  // 認証処理から認証署名を取得
  const user = await guard({ request: request, context: context });
  
  // 認証署名がない場合はエラー
  if (!user) {
    throw new Response(null, {
      status: 401,
      statusText: "署名の検証に失敗しました。",
    });
  }
  
  // URLパラメータからrefを取得
  const ref = new URL(request.url).searchParams.get("ref");
  console.log("ref=", ref);

  const likeAry:string[] = session.get("home-user-like");
  const commentAry:string[] = session.get("home-user-comment");

  console.log("like=", likeAry);
  console.log("comment=", commentAry);

  // FormData作成
  const formData = new FormData();
  formData.append("user[signature]", String(session.get("signin-auth-user-signature")));
  formData.append("user[kind]", String(ref));
  console.log("user[signature]=", formData.get("user[signature]"));
  console.log("user[kind]=", formData.get("user[kind]"));

  //魚種にあったトピックスと記事一覧API呼び出し
  const apiResponse = await fetch(`${ context.env.API_URL }/report/view`, { method: "POST", body: formData });
  // JSONデータを取得
  const jsonData = await apiResponse.json<LoaderApiResponse>();
  console.log("jsonData=", jsonData);
  //console.log("jsonData.MarketReports=", jsonData.MarketReports);
  //console.log("jsonData.MarketReports[0]=", jsonData.MarketReports[0]);
  //console.log("jsonData.FishmanReports=", jsonData.FishmanReports);
  //console.log("jsonData.topics=", jsonData.topics);
  // ステータス200以外の場合はエラー
  if (jsonData.status !== 200) {
    throw new Response(null, {
      status: jsonData.status,
      statusText: jsonData.messages.message,
    });
  }

  //セッションに魚種を保存
  session.set("home-report-kind", ref);

  //自分がほしいねした記事にフラグを立てる
  if (likeAry != null){
    likeAry.forEach(tmpid => {
      let lIndex : number;
  
      lIndex = jsonData.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonData.MarketReports[lIndex].like_flg = true;
      }
  
      lIndex = jsonData.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        jsonData.FishmanReports[lIndex].like_flg = true;
      }
    });      
  }

  //自分がコメントした記事にフラグを立てる
  if (commentAry != null){
    commentAry.forEach(tmpid => {
      let lIndex : number;
      
      console.log("comment.id=", tmpid);
      lIndex = jsonData.MarketReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("market comment on");
        jsonData.MarketReports[lIndex].comment_flg = true;
      }
  
      lIndex = jsonData.FishmanReports.findIndex(l => l.id == tmpid);
      if (lIndex >= 0){
        console.log("fishman comment on");
        jsonData.FishmanReports[lIndex].comment_flg = true;
      }
    });  
  }

  console.log("market");
  jsonData.MarketReports.forEach(tmp => {
    console.log("id=", tmp.id);
    console.log("comment_flg=", tmp.comment_flg);
  });
  console.log("jsonData.MarketReports[0]=", jsonData.MarketReports[0]);

  return json({
    market:  jsonData.MarketReports,
    fishman: jsonData.FishmanReports,
    topics:  jsonData.topics,
    ref: ref,
    uploads_url: context.env.UPLOADS_URL
  },
  {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });  
}

export default function Page() {
  // LOADER
  const loaderData = useLoaderData<typeof loader>();
  // Payloads
  const { market, fishman, ref, uploads_url } = loaderData;
  
  if (ref) {
    return (
      <>
        <section className={ "container" }>
          <div className={ "wrap" }>
            <Logo/>
          </div>
        </section>
        
        <section className={ "mb-8 relative" }>
          <figure className={ "block relative w-full pt-[66.7%] md:pt-[30.0%]" }>
            { (Number(ref) === 1) &&
            <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 2) &&
            <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 3) &&
            <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
            { (Number(ref) === 4) &&
            <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
            }
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-28 flex justify-center items-center" }>
            <span className={ "text-white text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>
              { (Number(ref) === 1) && "ふくいサーモン" }
              { (Number(ref) === 2) && "若狭ふぐ" }
              { (Number(ref) === 3) && "敦賀真鯛" }
              { (Number(ref) === 4) && "若狭まはた" }
            </span>
          </div>
        </section>
        
        <section className={ "container mb-12" }>
          <div className={ "wrap mb-8" }>
            <h2 className={ "text-28ptr font-semibold whitespace-nowrap" }>生産者の声</h2>
          </div>
          <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
            { fishman.map((repo) => (
            <ThumbPost 
              key={ repo.id }
              to={ `/home/reportview/?ref=view&kind=2&id=${ repo.id }` }
              nickname={ repo.nickname }
              isLiked={ repo.like_flg }
              likeCount={ repo.like_cnt }
              isCommented={ repo.comment_flg }
              commentCount={ repo.comment_cnt }
              title={ repo.title }
              uploadsUrl={ uploads_url }
            />
            )) }
            { fishman.length === 0 &&
            <p>記事はありません</p>
            }
          </div>
        </section>
        
        <section className={ "container" }>
          <div className={ "wrap mb-8" }>
            <h2 className={ "text-28ptr font-semibold whitespace-nowrap" }>福井中央卸売市場からのお知らせ</h2>
          </div>
          <div className={ "wrap grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8" }>
            { market.map((repo) => (
            <ThumbPost 
              key={ repo.id }
              to={ `/home/reportview/?ref=view&kind=2&id=${ repo.id }` }
              nickname={ repo.nickname }
              isLiked={ repo.like_flg }
              likeCount={ repo.like_cnt }
              isCommented={ repo.comment_flg }
              commentCount={ repo.comment_cnt }
              title={ repo.title }
              uploadsUrl={ uploads_url }
            />
            ))}
            { market.length === 0 &&
            <p>記事はありません</p>
            }
          </div>
        </section>
      </>
    );
  }
  
  return (
    <>
      <section className={ "container" }>
        <div className={ "wrap" }>
          <Logo/>
        </div>
      </section>
      
      <section className={ "mb-4 relative" }>
        <Link to={ "/home/pickup?ref=1" } className={ "block relative" }>
          <figure className={ "block relative w-full pt-[40.0%] md:pt-[30.0%] bg-black" }>
            <img src={ "/assets/images/home/salmon.webp" } alt={ "ふくいサーモン" } className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50 group-hover:opacity-70" }/>
          </figure>
          <div className={ "absolute bottom-0 left-0 bg-black/40 w-full h-28 flex justify-center items-center" }>
            <span className={ "text-white text-40ptr font-semibold tracking-wide whitespace-nowrap drop-shadow-lg" }>ふくいサーモン</span>
          </div>
        </Link>
        <Link to={ "/home/pickup?ref=2" }>
          <figure className={ "block relative w-full pt-[40.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/fugu.webp" } alt={ "若狭ふぐ" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
        </Link>
        <Link to={ "/home/pickup?ref=3" }>
          <figure className={ "block relative w-full pt-[40.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/madai.webp" } alt={ "敦賀真鯛" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
        </Link>
        <Link to={ "/home/pickup?ref=4" }>
          <figure className={ "block relative w-full pt-[40.0%] md:pt-[30.0%]" }>
            <img src={ "/assets/images/home/mahata.webp" } alt={ "若狭まはた" } className={ "absolute top-0 left-0 w-full h-full object-cover" }/>
          </figure>
        </Link>
      </section>
    </>
  );
}