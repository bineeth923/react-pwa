import React ,{ Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import List from '../../assets/workshops.json';
import PosterImage from '../../assets/dummy.jpg';

import './style.css';

class WSDetails extends Component {
    constructor(props) {
        super(props);
        this.state={
            posterTop:0,
            poster:PosterImage
        };
        this.workshopid = props.match.params.id;
        this.onImgLoad = this.onImgLoad.bind(this);
    }
    componentDidMount() {
        let that = this;
        const url = List[this.workshopid]?List[this.workshopid]['poster']:"";
		if(url == "")
			return;
        axios.get(url, { responseType: 'arraybuffer' })
        .then(function(response){
            // eslint-disable-next-line
            if(response.status == 200)
                that.setState({poster:"data:image/jpeg;base64,"+Buffer.from(response.data, 'binary').toString('base64')});
            else
                console.log("Error",response.status);
        })
        .catch(function(error){
            console.log(error);
        })
    }
    onImgLoad({target:img}) {
        this.scrollEvent(img.offsetHeight,this.divElement.clientHeight);
    }
    render() {
        if(!List[this.workshopid])
            return <Redirect to="/workshops" />;
        let details = List[this.workshopid];
        const poster = 
            <img onLoad={this.onImgLoad} style={{top:this.state.posterTop}} src={this.state.poster} alt=""/>;
        const people = [];
        for(let organizer in details.organizers) {
            people.push(
                <span key={people}>{details.organizers[organizer]["name"]}:<a href={"tel:"+details.organizers[organizer]["phone"]}>{details.organizers[organizer]["phone"]}</a></span>
            );
        }
        const instructions = [];
        for(let rule in details.instructions){
            instructions.push(
                <li key={rule}>{details.instructions[rule]}</li>
            );
        }
        const content =
            <div className="desc" ref={ (divElement) => this.divElement = divElement}>
                <div className="detail">
                    <div className="title">{details.name}</div>
                    <div className="top_bar">
                        <div className="contact">
                            <div className="phone">
                                <i className="fas fa-phone fa-2x fa-flip-horizontal"></i>
                            </div>
                            <div className="people">
                                {people}
                            </div>
                        </div>
                        <div className="prize">
                            <div className="info">
                                <i className="fas fa-info-circle fa-2x"></i>
                            </div>
                            <div className="info_desc">
                                <span>{details.regfee?details.regfee:""}</span>
                                <span>{details.date?details.date:""}</span>
                            </div>
                        </div>
                    </div>
                    <div className="reg-button">
                        <a href={details.reglink} target="_blank">
                            <button>Register</button>
                        </a>
                    </div>
                    <div className="description">
                        <div dangerouslySetInnerHTML={{__html:details.descr}}/>
                        {/* {instructions.length>0?<span>instructions:</span>:""} */}
                        {instructions.length>0?<ul>{instructions}</ul>:""}
                    </div>
                </div>
            </div>
        return(
            <div className="wsdetails-container">
                <i className="fas fa-arrow-left back-button"
                  onClick={()=>window.history.back()}></i>
                <div className="poster">
                    {poster}
                </div>
                {content}                
            </div>
        );
    }


    scrollEvent(img_height,content_height) {
        window.requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(f){setTimeout(f, 1000/60)};

        img_height = img_height * 1.25;
        // var img_height = document.getElementById('poster').height;


        var that = this;

        function parallaxbubbles(){
            var scrolltop = window.pageYOffset;
            var scrollable_height = img_height - document.body.clientHeight;
            if(scrollable_height < 0)
                scrollable_height = -scrollable_height;
            var slice = scrollable_height/content_height;
        
            // console.log(img_height + "  " + scrollable_height+ "  " + slice);
            let newTop = -scrolltop * slice;
            that.setState({posterTop:newTop});
            // console.log(newTop);
        }
        
        window.addEventListener('scroll', function(){ // on page scroll
            requestAnimationFrame(parallaxbubbles) // call parallaxbubbles() on next available screen paint
        }, false);
    }
}
export default WSDetails;
