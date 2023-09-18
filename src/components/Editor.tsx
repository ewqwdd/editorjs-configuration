'use client'
import useInitEditor from '@/hooks/useInitEditor'
import { CSSProperties, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import {useForm} from "react-hook-form"
import Output from 'editorjs-react-renderer'
import { OutputData } from '@editorjs/editorjs'

type TableOutputStyles = {
    table?: CSSProperties;
    tr?: CSSProperties;
    th?: CSSProperties;
    td?: CSSProperties;
};

type TableOutputData = {
    content: string[][];
};
type TableOutputClassNames = {
    table?: string;
    tr?: string;
    th?: string;
    td?: string;
};

type TableOutputProps = {
    data: TableOutputData;
    style?: TableOutputStyles;
    classNames?: TableOutputClassNames;
    config?: any;
};

let tableOutput = ({data, style, classNames}: TableOutputProps)=>{
    
    return(
        <table className='text-zinc-600 text-base m-auto'>
            {data.content.map((elem, index)=>{
                if(index===0){
                    return <tr key={String(index)} className={classNames?.tr}>
                        {elem.map((col, ind)=><th key={String(index)+String(ind)} className='outline outline-2 -outline-offset-1 px-3 py-2 outline-zinc-700'>{col}</th>)}
                    </tr>
                }
                return <tr key={String(index)}>
                    {elem.map((col, ind)=><td key={String(index)+String(ind)} className='outline outline-2 -outline-offset-1 px-3 py-2 outline-zinc-700'>{col}</td>)}
                </tr>
            })}
        </table>
    )
}

const Editor = ()=>{

    let {register, formState: {errors}, handleSubmit} = useForm()

    let [init, ref] = useInitEditor()

    let [content, setContent] = useState<OutputData>()

    useEffect(()=>{
        init()

        return ()=>{
            // ref.current?.destroy()
            // ref.current = undefined
        }
    })        

    const renderers = {
        table: tableOutput
    }
    

    return(<>
    
        <div className='m-12'>
            <div className="w-[48rem] resize-y m-auto border border-zinc-900 rounded-lg" id="editor" />
            <form onSubmit={handleSubmit(async(formData)=>{
               let data = await ref.current?.save()
               setContent(data)
            })}>

            <button type="submit">Submit</button>
            </form>
            
        </div>
        {content ? <div className='max-w-6xl shadow my-10 mx-auto p-6' ><Output renderers={renderers} data={content} /></div> : null}
        
        </>
    )
}

export default Editor