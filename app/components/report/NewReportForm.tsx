import { useNavigation, Link, Form } from "@remix-run/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Report as ReportFormData } from "~/types/Report";
import { ValidatedForm } from "remix-validated-form";
import { ReportSchema_step1 } from "~/schemas/newreport";
import TitleInput from "~/components/report/form/TitleInput";
import DetailInput from "~/components/report/form/DetailInput";
import { useRef, useState } from "react";

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

/*
export async function createUploadImage(file: File) {
  const formData = new FormData();

  Object.entries({ file }).forEach(([key]) => {
    formData.append(key, file);
  });

  const res = await axios.post(`api/detail/view`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data
}
*/

interface Step1Props {
    ReportFormData: ReportFormData;
}

export function Step1({ ...props }: Step1Props) {

  const { ReportFormData } = props;
  const navigation = useNavigation();
  const inputFileRef = useRef<HTMLInputElement>(null);
  //const handleClickUpload = async () => {
  //  const fileList = inputFileRef.current?.files;
  //  if (!fileList) {
  //      return;
  //  }
  //  const file = fileList[0];
    //const res = await createUploadImage(file);
    //console.log(res);
  //};

  const [previewImage, setPreviewImage] = useState("");
  const handleChangePreview = (ev: React.ChangeEvent<HTMLInputElement>) => {
    alert("chgevent");
    if (!ev.target.files) {
      alert("non files");
      return;
    }
    const file = ev.target.files[0];

    console.log("file=", file);
    alert("file=" + file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <ValidatedForm
        validator={ ReportSchema_step1 } 
        method={ "POST" }
        action={ `?step=1` }
      >
      <div className={ "container" }>
        <div className={ "wrap" }>
          <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>新規投稿</h2>
          <div>
            <img alt="画像が選択されていません。" />
            <input
              type="file"
              onChange={handleChangePreview}
              ref={inputFileRef}
              accept="image/*"
              style={{ display: "none" }}
            />
            <button onClick={() => inputFileRef.current?.click()}>
              ファイルを選択
            </button>
          </div>
          <fieldset>
            <label>魚種</label>
            <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.kind }</p>
          </fieldset>
          <TitleInput name={"report[title]"} defaultValue={ ReportFormData.title} />
          <DetailInput name={"report[detail]"} defaultValue={ ReportFormData.detail} />
          <input type={ "hidden" } name={ "step" } value={ 1 }/>
          <div className={ "flex gap-2 md:gap-8" }>
            <button 
              type={ "submit" }
              className={ "button button--primary" }
            >
              投稿確認画面へ
            </button>
          </div>
        </div>  
      </div>
    </ValidatedForm>
  );
}

interface Step2Props {
  ReportFormData: ReportFormData;
}

export function Step2({ ...props }: Step2Props) {

  const { ReportFormData } = props;

  return (
    <Form
      method={ "POST" }
      action={ `?step=2` }
      className={ "confirm-form" }
    >
      <h2 className={ "text-gray-600 text-22ptr md:text-28ptr font-bold mb-4" }>投稿記事の確認</h2>
      <fieldset>
          <label>魚種</label>
          <p className={ "text-22ptr md:text-26ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.kind }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
      <label>タイトル</label>
      <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>{ ReportFormData.title }</p>
      </fieldset>

      <fieldset className={ "border-b-2 border-solid pb-2" }>
      <label>本文</label>
      <p className={ "text-20ptr md:text-22ptr text-gray-600 font-semibold font-roboto" }>
        <div className='break-words whitespace-pre'>
          { ReportFormData.detail }
        </div>
      </p>
      </fieldset>

      <input type={ "hidden" } name={ "step" } value={ 2 }/>
      <div className={ "wrap" }>
        <Link to={ `/home/newspost?step=1` } className={ "button button--secondary" }>
          前へ
        </Link>
        <button 
            type={ "submit" }
            className={ "button button--primary" }
        >
        この内容で投稿</button>
      </div>  
    </Form>
  );
}