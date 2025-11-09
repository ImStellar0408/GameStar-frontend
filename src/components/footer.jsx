import './footer.css'
import 'boxicons'
import { useState } from 'react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-left">
                    <p className="copyright">© 2024 GameStar. All rights reserved.</p>
                </div>

                <div className="footer-center">
                    <ul className="social-list">
                        <li><a aria-label="GitHub" href="https://github.com/ImStellar0408"><box-icon name='github' type='logo' color='#ffffff' ></box-icon></a></li>
                        <li><a aria-label="Instagram" href="https://www.instagram.com/im_nelly2009/"><box-icon type='logo' name='instagram' color='#ffffff'></box-icon></a></li>
                        <li><a aria-label="Twitter" href="https://x.com/NellyEstelaRam1"><box-icon type='logo' name='twitter' color='#ffffff'></box-icon></a></li>
                        <li><a aria-label="YouTube" href="https://www.youtube.com/@ItsGatillo"><box-icon type='logo' name='youtube' color='#ffffff'></box-icon></a></li>
                    </ul>
                    <p className="follow">Follow creator on social media</p>
                </div>

                <div className="footer-right">
                    <div className="footer-logo" aria-hidden="false">
                        <img src="src/assets/GameStar.svg" alt="" />
                    </div>
                </div>
            </div>
        </footer>
    )
}