import { useCallback, useRef } from "react"
import type EditorJS from "@editorjs/editorjs"

export default (): [()=>Promise<void>, React.RefObject<EditorJS | undefined>]=>{

    let ref = useRef<EditorJS>()

    return [useCallback(async()=>{
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const Table = (await import("editorjs-table")).default
        const List = (await import("@editorjs/list")).default
        const Code = (await import("@editorjs/code")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default
        const ImageTool = (await import("@editorjs/image")).default
        const HyperLink = (await import("editorjs-hyperlink")).default
        const Marker = (await import("@editorjs/marker")).default
        const Underline = (await import("@editorjs/underline")).default

        if(!ref.current){
            ref.current = new EditorJS({
                holder: 'editor',
                autofocus: true,
                tools:{
                    image: {
                        class: ImageTool,
                        config:{
                            uploader: {
                                async uploadByFile(file: File){
                                    let body = new FormData()
                                    body.append('file', file, file.name)

                                    let res = await fetch(`${process.env.DOMAIN_URL}/api/upload`, {
                                        method: 'POST',
                                        body
                                        })

                                    let data = await res.json()
                                    
                                    return {
                                        success: 1,
                                        file: {
                                            url: data[0].url
                                        }
                                    }
                                }
                            }
                        }
                    },
                    list: List,
                    embed: Embed,
                    link: LinkTool,
                    //@ts-ignore
                    header: Header,
                    code: Code,
                    table: Table,
                    inlineCode: InlineCode,
                    hyperlink: {
                        class: HyperLink,
                        config:{
                            target: '_blank',
                            rel: 'nofollow',
                            availableTargets: ['_blank', '_self'],
                            availableRels: ['author', 'noreferrer'],
                            validate: false,
                        }
                    },
                    marker: Marker,
                    underline: Underline
                },
                
                
            })
        }
    }, []), ref]
    
}