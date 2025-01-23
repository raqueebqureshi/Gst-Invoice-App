import { Icon } from "@shopify/polaris";
import React, { useEffect, useState, useCallback, use } from "react";
// import {
//   LogoYoutubeIcon,
//   LogoFacebookIcon,
//   LogoInstagramIcon,
//   LogoXIcon,
//   LogoPinterestIcon,
// } from "@shopify/polaris-icons";
import { FaFacebook , FaYoutube , FaPinterestP} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


import { AiFillInstagram } from "react-icons/ai";


const MediaIcons = ({ socialLink, invoiceSetting }) => {
  const [socialLinks, setSocialLinks] = useState({
    facebookURL: "",
    xURL: "",
    instagramURL: "",
    pinterestURL: "",
    youtubeURL: "",
  });


//   useEffect(() => {
//     fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.profile) {
//           const profileData = data.profile;
//           console.log("profileData.socialLinks", profileData.socialLinks);
//           setSocialLinks(profileData.socialLinks || {});
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching store profile:", error);
//       });
//   }, [shopId]);


useEffect(() => {
  setSocialLinks(socialLink);
}, [socialLink]);


  return (
    <>
    {socialLinks && (<div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      {invoiceSetting.footer.socialNetworks.showYoutube ? (
        <>
          {/* YouTube */}
          <a
            href={socialLinks.youtubeURL || "https://youtube.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color:"black"
            }}
          >
          <FaYoutube />


          </a>
        </>
      ) : (
        <></>
      )}


      {invoiceSetting.footer.socialNetworks.showFacebook? (
        <>
          {/* Facebook */}
          <a
            href={socialLinks.facebookURL || "https://facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color:"black"
            }}
          >
           <FaFacebook />


          </a>
        </>
      ) : (
        <></>
      )}
      {invoiceSetting.footer.socialNetworks.showInstagram ? (
        <>
          {/* Instagram */}
          <a
            href={socialLinks.instagramURL || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color:"black"
            }}
          >
           <AiFillInstagram />


          </a>
        </>
      ) : (
        <></>
      )}
      {invoiceSetting.footer.socialNetworks.showTwitter ? (
        <>
          {/* X (formerly Twitter) */}
          <a
            href={socialLinks.xURL || "https://x.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color:"black"
            }}
          >
            <FaXTwitter />
          </a>
        </>
      ) : (
        <></>
      )}
      {invoiceSetting.footer.socialNetworks.showPinterest ? (
        <>
          {/* Pinterest */}
          <a
            href={socialLinks.pinterestURL || "https://pinterest.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color:"black"
            }}
          >
           <FaPinterestP />


          </a>
        </>
      ) : (
        <></>
      )}
    </div>)}
   
    </>
  );
};


export default MediaIcons;





