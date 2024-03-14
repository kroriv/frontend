import { Link, Form } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/cloudflare";
import { motion, HTMLMotionProps } from "framer-motion";
import parse from "html-react-parser";
import { loader as ReportViewLoader, action as ReportViewAction } from "~/routes/home.reportview";
import { FaRegCommentAlt, FaCommentAlt  } from "react-icons/fa";
import { TbStar, TbStarFilled } from "react-icons/tb";

import { ValidatedForm } from "remix-validated-form";
import { CommentSchema } from "~/schemas/newcomment";
import CommentInput from "~/components/report/form/CommentInput";
import { useRef, useCallback } from "react";

export function Wrap({ ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeIn" }}
      { ...props }
    >
      { props.children }
    </motion.div>
  );
}

interface ReprtViewFormProps {
  loaderData: SerializeFrom<typeof ReportViewLoader>;
}

/** 記事部分を分離 */
export function Post({ ...props }: ReprtViewFormProps) {
  // LOADER
  const loader = props.loaderData;
  // Payloads
  const { kind, likenum, comments, report, uploads_url } = loader;
  const { title, nickname, detail_modify } = report as { title: string, nickname: string, detail_modify: string }; /** 型定義してください */
  
  return (
    <div className={ "px-0 md:px-[10%] py-0 md:py-[5%] flex flex-col gap-4" }>
      
      <div className={ "bg-gray-300 w-full min-h-[300px] md:min-h-[600px]" }>
        {/* サムネイル画像を入れてください */}
      </div>
      
      <div>
        <h2 className={ "text-28ptr md:text-36ptr font-semibold" }>{ title }</h2>
        <p className={ "text-gray-500" }>{ nickname }</p>
        { Number(kind) === 2 && 
        <div className={ "flex justify-start items-center gap-4" }>
          <div className={ "flex justify-start items-center gap-2" }>
            {/* 自分がほしいねしたかの判定でアイコン色の分岐が必要なのでLoaderから取得してください */}
            { <TbStar className={ "text-gray-500" }/> }
            <span className={ "text-gray-500" }>{ likenum || 0 }</span>
          </div>
          <div className={ "flex justify-start items-center gap-2" }>
            {/* 自分がコメントしたかの判定でアイコン色の分岐が必要なのでLoaderから取得してください */}
            { <FaRegCommentAlt className={ "text-gray-500" }/> }
            <span className={ "text-gray-500" }>{ Number(comments!.length) }</span>
          </div>
        </div>
        }
      </div>
      
      {/* 本文エリア */}
      <div className={ "break-words whitespace-pre" }>
        { parse(detail_modify.replace("/cmsb/uploads", uploads_url)) }
      </div>
      
      
      { Number(kind) === 2 && 
      <div className={ "flex justify-start items-center gap-4" }>
        <div className={ "flex justify-start items-center gap-2 " }>
          <Form
            method={ "POST" }
            action={ `?ref=view` }
            className={ "border-solid border-[1px] border-gray-400 rounded-full flex justify-center items-center p-3" }
          >
            {/* 自分がほしいねしたかの判定でアイコン色の分岐が必要なのでLoaderから取得してください */}
            <button 
              type={ "submit" }
              className={ "px-0 py-0" }
              name={ "likeid" }
              value={ report!.id }
            >
              { <TbStar className={ "text-gray-500 text-[140%]" }/> }
            </button>
          </Form>
          <span className={ "text-gray-500" }>{ likenum || 0 }</span>
        </div>
        <div className={ "flex justify-start items-center gap-2" }>
          {/* 自分がコメントしたかの判定でアイコン色の分岐が必要なのでLoaderから取得してください */}
          { <FaRegCommentAlt className={ "text-gray-500 text-[120%]" }/> }
          <span className={ "text-gray-500" }>{ Number(comments!.length) }</span>
        </div>
      </div>
      }
    </div>
  );
}

/** コメント部分を分離 */
export function Comments({ ...props }: ReprtViewFormProps) {
  // LOADER
  const loader = props.loaderData;
  // Payloads
  const { kind, likenum, comments, report } = loader;
  // Refs
  const commentRef = useRef<HTMLInputElement>(null);
  // Callbacks
  const clear = useCallback(() => {
    if (commentRef && commentRef.current) {
      commentRef.current.value = "";
    }
  }, [commentRef]);
  
  return (
    <div id={ "comments" }>
      <div className={ "flex flex-col gap-4 px-0 md:px-[10%] py-4 md:py-0 md:pt-[5%]" }>
        { comments!.map((come) => (
        <div key={ come.num }>
          <p className={ "text-gray-500 text-[86%] whitespace-nowrap leading-none" }>{ come.nickname }</p>
          {/*<p>コメント日時{come.updatedDate.toString()}</p>*/}
          <p className={ "break-words whitespace-pre text-[92%]" }>
            { come.comment }
          </p>
        </div>
        ))}
      </div>
      
      {/* コメントフォーム::スマホ・タブレットなどの場合 */}
      { Number(kind) === 2 &&
      <Link to={ `/home/reportview?ref=comment&id=${ report!.id }` } className={ "group flex md:hidden justify-center items-center gap-4 button button--secondary" }>
        <FaCommentAlt className={ "text-[#003371] group-hover:text-white" }/>
        <span>コメントする</span>
      </Link>
      }
      
      {/* コメントフォーム::大きめ画面の場合 */}
      { Number(kind) === 2 &&
      <ValidatedForm
        validator={ CommentSchema } 
        method={ "POST" }
        className={ "confirm-form px-0 py-0 md:px-[10%] mt-4 hidden md:block" }
        onSubmit={ clear }
      >
        <input type={ "text" } name={ "report[comment]" } placeholder={ "コメントを入力してからEnterボタンを押すと送信します" } className={ "rounded-full bg-[#ededed] placeholder:text-[80%] border-none" } ref={ commentRef }/>        
        <input type={ "hidden" } name={ "form" } value={ "CommentUpdate" } />
        <button type={ "submit" } className={ "button button--primary hidden" }>上記の内容でコメント</button>
      </ValidatedForm>
      }
      
      <div className={ "px-0 md:px-[10%] pt-8" }>
        <button 
          type={ "button" }
          className={ "button button--primary" }
        >
          ご注文・お問い合わせ
        </button>
      </div>

      {/* <p><Link to={ `/home/pickup?ref=${report!.fishkind}` }>一覧に戻る</Link></p> */}
    </div>
  );
}

