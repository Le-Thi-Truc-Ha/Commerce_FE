import { useState, type JSX } from "react";
import "./Home.scss";
import { Col, Row } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Home = (): JSX.Element => {
    const [bannerActive, setBannerActive] = useState<number>(0);

    const urlBanners = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Beige_Aesthetic_New_Arrival_Fashion_Banner_Landscape_vqsazn.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Gray_and_Beige_Modern_Fashion_Banner_swwy4s.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Peach_Orange_and_Brown_Illustrative_Autumn_Big_Sale_Promotion_Banner_Landscape_bzuoru.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Brown_and_White_Modern_Fashion_Collection_Banner_Landscape_hadcta.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_1_lbtce5.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_swnotc.png"   
    ]

    const categories: {name: string, url: string}[] = [
        {name: "Áo", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751103/tshirt_enlypz.png"},
        {name: "Quần", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/pants_yfrgrx.png"},
        {name: "Váy", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751847/dress_tvwba9.png"},
        {name: "Đầm", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/skirt_tbxhg5.png"},
        {name: "Giày", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/high-heels_nsomr4.png"},
        {name: "Túi", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/handbag_sge74h.png"},
    ]

    const controlSlider = (nameButton: string) => {
        if (nameButton == "left") {
            if (bannerActive == 0) {
                setBannerActive(urlBanners.length - 1);
            } else {
                setBannerActive(bannerActive - 1)
            }
        } else {
            if (bannerActive == urlBanners.length - 1) {
                setBannerActive(0);
            } else {
                setBannerActive(bannerActive + 1)
            }
        }
    }
    
    return(
        <>
            <Row className="home-container">
                <Col span={24}>
                    <div style={{position: "relative", width: "100%"}}>
                        <div style={{width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4"}}>
                            <div style={{height: "90%", width: "100%"}}>
                                <div style={{width: "100%", height: "100%"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%"}}>
                                        {urlBanners.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                loading="eager"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    maxHeight: "100%", 
                                                    height: "fit-content", 
                                                    maxWidth: "100%",
                                                    objectFit: "contain",
                                                    objectPosition: "center",
                                                    borderRadius: "20px",
                                                    boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)",
                                                    opacity: bannerActive === index ? 1 : 0,
                                                    transition: "opacity 0.5s ease"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div style={{width: "100%", position: "absolute", bottom: "5px", display: "flex", justifyContent: "center", gap: "15px"}}>
                            {
                                urlBanners.map((_, index) => (
                                    <div 
                                        key={index} 
                                        className={`indicator ${bannerActive == index ? "indicator-active" : ""}`}
                                        onClick={() => {setBannerActive(index)}}
                                    ></div>
                                ))
                            }
                        </div>
                        <div style={{width: "100%", position: "absolute", top: "50%", transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", padding: "0px 30px"}}>
                            <div className="background-control" onClick={() => {controlSlider("left")}}>
                                <ArrowLeft size={24} strokeWidth={1} stroke="white" />
                            </div>
                            <div className="background-control" onClick={() => {controlSlider("right")}}>
                                <ArrowRight size={24} strokeWidth={1} stroke="white" />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={24} style={{paddingTop: "30px", display: "flex", justifyContent: "center"}}>
                    <div style={{width: "90%", backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                        <div style={{fontFamily: "Prata", fontSize: "30px", width: "100%", textAlign: "center", paddingBottom: "20px"}}>Danh mục</div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "80px"}}>
                            {
                                categories.map((item, index) => (
                                    <div className="category" key={index}>
                                        <img className="icon-category" loading="eager" src={item.url} />
                                        <div className="name-category">{item.name}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Col>
                <Col span={24}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio, est possimus error dolorum voluptatum ea sit? Voluptate rerum nesciunt vitae ipsam, sint est possimus doloremque. Repellat ratione dolor harum quam?
                Laborum consectetur tempora commodi quas, necessitatibus quia? Tempore ipsum unde voluptate fuga? Porro nobis earum deleniti, ab unde natus aperiam laborum quo cupiditate excepturi similique in itaque quia blanditiis nisi.
                Corporis repellat ipsam doloribus voluptatum magnam. Corrupti, quod facilis? Sint, quia? Quos architecto temporibus fuga nisi est magni voluptate necessitatibus incidunt totam. Excepturi et enim assumenda unde eveniet, corporis maxime?
                Maxime reiciendis in error, enim autem voluptate fuga excepturi. Aspernatur quis quo tempore reprehenderit consequuntur necessitatibus repellendus. Accusamus eligendi laudantium exercitationem at ipsam quibusdam, a illo iusto voluptatem commodi! Excepturi?
                Placeat ipsa hic deleniti earum fuga corrupti voluptate modi voluptas praesentium eaque ducimus excepturi ad facere possimus optio sunt tenetur voluptatibus rem iusto, laboriosam exercitationem id! Veritatis, totam. Enim, nulla!
                Dolore officiis ut eaque mollitia eos vel porro voluptatem qui reprehenderit. Ipsum temporibus, ut recusandae et eveniet asperiores itaque aut esse tempore culpa dolorem aliquid? Maiores quasi excepturi vel voluptatem.
                Libero sapiente dolore hic molestiae dolores deleniti. A, sunt. Accusantium esse possimus molestiae laudantium sunt ipsum eum consequuntur assumenda! Iste dolorum repellendus beatae distinctio repudiandae quaerat qui laudantium maiores architecto.
                Qui distinctio, unde maiores molestiae beatae, asperiores cum aspernatur quas sit ratione assumenda nemo atque aliquam architecto iste perspiciatis laboriosam accusantium expedita excepturi blanditiis dolorem error. Similique nisi sint dolor.
                Voluptatibus tempora, alias quidem saepe reprehenderit laboriosam unde sunt voluptas repellat ex corrupti? Libero, eveniet officia. Dolores, amet ipsam, corporis atque nesciunt totam laboriosam doloribus consectetur deserunt accusamus iste corrupti!
                Iure ad quisquam recusandae tempora voluptas nihil reprehenderit iusto, laborum consequuntur ullam perspiciatis nostrum cumque soluta, illo itaque deserunt, corporis numquam nemo natus. Nulla, et enim. Quasi ipsum maxime reiciendis.
                Fuga provident sint quae illo nostrum, dolor cum ad incidunt! Velit provident consequatur consectetur voluptatem? Illum, distinctio doloribus. Consequatur nulla cupiditate unde blanditiis aliquam illo rerum nobis harum qui veniam?
                Beatae perspiciatis nisi sit molestiae iusto, suscipit labore blanditiis, corrupti, facilis ut quasi sequi eaque fuga consequatur soluta et distinctio impedit eius iste deserunt. Quos fugit voluptatem a iusto ab.
                Fugit, deleniti. Maxime quod sed odit consequatur asperiores ullam tenetur quidem quas quia adipisci. Quam tenetur eaque in, perspiciatis aspernatur modi minus ipsam qui quos facilis nemo saepe, cumque ratione?
                Minus est rem labore incidunt in odit, esse, molestias voluptatibus omnis repellat pariatur, quos non porro deleniti modi nulla earum vero! Neque atque dolore ipsam porro numquam iusto architecto adipisci!
                Ea obcaecati ratione provident dolor expedita eveniet velit aliquid illum voluptas vero. Minus fugit at molestias placeat suscipit hic, illum nulla distinctio dolor, maiores a ratione temporibus ut error sint.
                Repudiandae, nobis commodi! Eveniet dignissimos doloribus sed corrupti voluptatem sint sapiente ex maiores dolorum, enim error sunt officia magnam necessitatibus nemo, atque magni aliquam, minus impedit praesentium excepturi explicabo ipsam!
                Inventore quia sequi nobis et, odio omnis in eaque! Porro perferendis animi a delectus aut, deserunt quod expedita minima ab unde suscipit est, illum quibusdam sapiente nesciunt velit reprehenderit cupiditate?
                Asperiores sunt deserunt alias. Accusamus magni eveniet assumenda veritatis mollitia sed, illum corrupti debitis nobis molestiae odio explicabo doloremque id. Atque deserunt numquam quidem repudiandae repellat. Accusamus excepturi provident alias?
                Perspiciatis nostrum, consequatur iste sapiente consectetur nam dolorum. Qui tenetur cumque atque, placeat odio quod, labore ullam, minima commodi blanditiis excepturi? Corrupti officia necessitatibus nostrum quos incidunt, nobis deserunt blanditiis!
                Ex eum quis doloribus, quidem voluptas officia ipsam facilis enim porro error? Quisquam, id dolorum, nihil nemo labore possimus facilis, molestias minima exercitationem cupiditate aspernatur maxime nesciunt quidem nobis ullam!
                Fugiat repellendus perspiciatis magni. Quam dicta et quod autem sunt fugiat explicabo sed, a incidunt reprehenderit ea repudiandae voluptatem iure voluptate quia, officia ad consequuntur eos atque magni amet natus!
                Enim vero deserunt quo officiis! Sed id officiis sequi ipsa, laudantium ex aliquam quidem voluptatibus hic maxime labore nemo accusamus quam adipisci nihil pariatur voluptatum iusto! A veritatis repellat voluptatem!
                Quas labore aut, exercitationem sit nulla molestiae totam vitae nesciunt numquam adipisci? Pariatur doloremque repudiandae libero sint amet placeat maiores sed iusto, ad, voluptatem quae qui rem tenetur cum consequuntur!
                Eligendi ad sed porro esse totam nisi magnam, odio repellendus nesciunt magni atque at, veritatis non quam cum. Quisquam a nihil perferendis nam quae voluptatibus ab quibusdam saepe, molestias iure.
                Libero consequatur eveniet nobis possimus assumenda quos, facere accusamus explicabo voluptates saepe natus iste blanditiis aperiam cupiditate? Fuga architecto beatae minima dicta, iure fugiat, aut, earum debitis corrupti cupiditate quia!
                Reprehenderit possimus rem dolores ducimus eum, cum quaerat aliquam labore dolorum voluptates necessitatibus totam ipsa beatae maxime enim facilis. Impedit quia numquam debitis in id eveniet mollitia atque aliquid dolorum?
                Adipisci eveniet sit cumque saepe dicta, eaque perferendis nostrum ut voluptatem obcaecati debitis nisi sint consectetur porro laborum suscipit esse neque. Eveniet quo laudantium unde iure sunt ad totam voluptas?
                Explicabo voluptas cum incidunt distinctio ipsam illo dolor! Neque maiores fugit perferendis magnam nulla ullam mollitia temporibus nostrum consequatur earum. Cumque tenetur cum temporibus, placeat ipsam ad repellendus dolore modi.
                Assumenda repudiandae autem dolores minima, sed officiis culpa vero dolor harum voluptatem quis quos. Saepe, animi beatae quasi, pariatur nihil at dolore veritatis earum ipsum facilis nisi nulla. Quidem, inventore?
                Culpa obcaecati doloremque error, quisquam consectetur eius harum a aliquid recusandae voluptatem maxime? Minima ipsa deserunt illum sit possimus a dolorem quasi provident ullam rem eius, sed impedit at voluptatibus.</Col>
            </Row>
        </>
    )
}

export default Home;