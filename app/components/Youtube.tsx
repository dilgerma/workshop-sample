export default function Video(props: { loom?: boolean, video: string, playlist?: boolean, title: string, desc?: string }) {
    return (<div>
        <div className="has-text-centered top-margin">
            <h3>{props.title}</h3>
            <div className={"top-margin"}>{props.desc}</div>
            {!props.loom ?
                <div className={"top-margin"}>

                    { props?.playlist ?
                        <iframe id="ytplayer"
                                width="500" height="281"
                                src={"https://www.youtube-nocookie.com/embed?listType=playlist&list=" + props.video + "&autoplay=0"}
                                frameBorder="0" allowFullScreen/> :
                        <iframe id="ytplayer" width="500" height="281"
                                src={"https://www.youtube-nocookie.com/embed/" + props.video + "?autoplay=0"}
                                frameBorder="0" allowFullScreen/>}

                </div> : <span/>}
            {props.loom ?
                <div className={"top-margin"}>
                    <iframe
                        src="https://www.loom.com/embed/bf77466e592848098008928403a2b9fc"
                        frameBorder="0" allowFullScreen width="500"
                        height="281"></iframe></div>
                : <span/>}
        </div>
    </div>)
}