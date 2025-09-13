import type { JSX } from "react";
import "./Home.scss";
import { Carousel, Col, Row } from "antd";

const Home = (): JSX.Element => {
    const urlBanners = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1756229129/e583ad3d-3c98-4cc4-b12b-0023fb0c5b58_large_xepag7.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1757520149/electronics-store-facebook-cover-template_htcind.png"
    ]
    return(
        <>
            <Row className="home-container">
                <Col span={24}>
                    <Carousel style={{height: "650px", width: "100%", backgroundColor: "var(--baseOne)", paddingTop: "40px"}}>
                        {
                            urlBanners.map((item, index) => (
                                <div key={index} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                                    <img style={{maxWidth: "60%", height: "auto", objectFit: "contain", borderRadius: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}} src={item} />
                                </div>  
                            ))
                        }
                    </Carousel>
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