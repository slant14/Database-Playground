import React from "react"
import "./footer.css";
import { MdEmail } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footeree">
        <span> <p style={{marginLeft: '10px'}}>Contact us via</p> <a href=""><MdEmail size={25}/></a> <a href="https://t.me/its_literallyme"><FaTelegramPlane size={25} /></a> <a href="https://github.com/S25-SWP-Team46"><IoLogoGithub size={25} /></a> <p style={{marginLeft: '15px'}}> © 2025 Team 46. All rights reserved.</p></span>
      </footer>
    )
  }
}

export default Footer