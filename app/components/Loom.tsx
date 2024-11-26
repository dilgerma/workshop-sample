export default function LoomVideo(props: { video: string, title: string, desc?: string }) {
    var url = `https://www.loom.com/embed/${props.video}?sid=2a6823b3-597d-4bec-9ad1-7a4f39a90964`
    return (
        <div className="has-text-centered top-margin">
            <h3>{props.title}</h3>
            <div className={"top-margin"}>{props.desc}</div>
            <div className={"top-margin"}>
                <div style={{"position": "relative", "height": "0",
                    // @ts-ignore
                    "padding-bottom": "64.67065868263472%"}}>
                    <iframe
                        src={url}
                        //@ts-ignore
                        frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen style={{
                        "position": "absolute",
                        "top": 0,
                        "left": 0,
                        "width": "100%",
                        "height": "100%"
                    }}></iframe>
                </div>

            </div>
        </div>)
}