import { Col, Input, Modal, Rate, Row } from "antd";
import { FileImage, FileVideo, Image, Star, Video, X } from "lucide-react";
import { useContext, useEffect, useRef, useState, type JSX } from "react";
import type { FeedbackModalProps } from "../../../interfaces/customerInterface";
import { messageService } from "../../../interfaces/appInterface";
import { UserContext } from "../../../configs/globalVariable";
import dayjs from "dayjs";
import { getFeedbackOrderApi, sendFeedbackApi, updateFeedbackApi } from "../../../services/customerService";
import LoadingModal from "../../Other/LoadingModal";
import lodash from "lodash";
import { addProductRecent } from "../../../services/appService";

const FeedbackModal = ({openModal, setOpenModal, name, size, color, url, productVariantId, productId, orderId, mode, setFeedbackOrderId}: FeedbackModalProps): JSX.Element => {
    const {TextArea} = Input;
    const maxSizeVideo = 10;
    const maxSizeImage = 1;
    const {user} = useContext(UserContext);
    const videoRef = useRef<(HTMLInputElement | null)[]>([]);
    const imageRef = useRef<(HTMLInputElement | null)[]>([]);
    const [feedbackId, setFeedbackId] = useState<number[]>([]);
    const [rateValue, setRateValue] = useState<number[]>([]);
    const [content, setContent] = useState<string[]>([]);
    const [videoRaw, setvideoRaw] = useState<{productId: number, productVariantId: number, video: File}[]>([]);
    const [imageRaw, setImageRaw] = useState<{productId: number, productVariantId: number, image: File[]}[]>([]);
    const [media, setMedia] = useState<{productVariantId: number, media: {id: number, url: string, type: number}[]}[]>([]);
    const [validate, setValidate] = useState<boolean[]>([]);
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [firstMediaId, setFirstMediaId] = useState<number[]>([]);
    const [firstContent, setFirstContent] = useState<string[]>([]);
    const [firstRate, setFirstRate] = useState<number[]>([]);

    const videoClick = (index: number) => {
        videoRef.current[index]?.click();
    }
    const imageClick = (index: number) => {
        imageRef.current[index]?.click();
    }

    useEffect(() => {
        if (openModal && mode == "create") {
            setRateValue(Array(name.length).fill(5))
            setContent(Array(name.length).fill(""))
            setValidate(Array(name.length).fill(false))
        }
        if (openModal && mode == "update") {
            getFeedbackOrder()
        }
    }, [openModal])

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenEl =
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement;
            setIsExpand(!!fullscreenEl);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);

    const getFeedbackOrder = async () => {
        setSkeletonLoading(true);
        try {
            const result = await getFeedbackOrderApi(orderId, user.accountId)
            if (result.code == 0) {
                const feedbacks: {content: string, id: number, medias: {id: number, type: number, url: string}[], productVariantId: number, star: number}[] = result.data.feedbacks;
                setFeedbackId(feedbacks.map((item) => (item.id)))
                const mediaId: number[] = [];
                for (const item of feedbacks) {
                    setFirstContent((prev) => ([...prev, item.content]))
                    setFirstRate((prev) => ([...prev, item.star]));
                    for (const m of item.medias) {
                        mediaId.push(m.id);
                    }
                }
                setFirstMediaId(mediaId);
                for (const item of productVariantId) {
                    const feedback = feedbacks.find((i) => (i.productVariantId == item));
                    if (feedback) {
                        rateValue.push(feedback.star);
                        content.push(feedback.content);
                        feedbackId.push(feedback.id);
                        const existMedia = media.find((i) => (i.productVariantId == feedback.productVariantId));
                        
                        if (existMedia) {
                            setMedia((prev) => (
                                prev.map((i) => (i.productVariantId == feedback.productVariantId ? {...i, media: feedback.medias.map((m) => ({url: m.url, type: m.type, id: m.id}))} : i))
                            ))
                        } else {
                            setMedia((prev) => (
                                [
                                    ...prev,
                                    {
                                        productVariantId: feedback.productVariantId,
                                        media: [
                                            ...feedback.medias.filter((m) => (m.type == 2)).map((m) => ({
                                                url: m.url,
                                                id: m.id,
                                                type: m.type
                                            })),
                                            ...feedback.medias.filter((m) => (m.type == 1)).map((m) => ({
                                                url: m.url,
                                                id: m.id,
                                                type: m.type
                                            }))
                                        ]
                                    }
                                ]
                            ))
                        }
                    }
                }
            } else {
                messageService.error(result.message)
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server")
        } finally {
            setSkeletonLoading(false);
        }
    }

    const checkValidate = (): boolean => {
        const newArray = [...validate]
        for (let i = 0; i < content.length; i++) {
            if (content[i].length == 0) {
                newArray[i] = true
            }
        }
        setValidate(newArray);
        for (const item of newArray) {
            if (item) {
                messageService.error("Không được để trống nội dung đánh giá")
                return true;
            }
        }
        return false
    }
    const checkUpdate = (): {isUpdate: boolean, currentMediaId: number[]} => {
        const currentMediaId: number[] = [];
        for (const item of media) {
            for (const m of item.media) {
                currentMediaId.push(m.id)
            }
        }
        if (currentMediaId.includes(-1) || !lodash.isEqual(firstMediaId, currentMediaId)) {
            return {isUpdate: true, currentMediaId};
        }
        if (!lodash.isEqual(firstContent, content)) {
            return {isUpdate: true, currentMediaId};
        }
        if (!lodash.isEqual(firstRate, rateValue)) {
            return {isUpdate: true, currentMediaId};
        }
        return {isUpdate: false, currentMediaId};
    }
    const sendFeedback = async () => {
        if (!checkValidate()) {
            setModalLoading(true)
            try {
                const formData = new FormData();
                for (const item of videoRaw) {
                    formData.append(`${item.productId}=${item.productVariantId}`, item.video)
                }
                for (const item of imageRaw) {
                    item.image.forEach((i) => (
                        formData.append(`${item.productId}=${item.productVariantId}`, i)
                    ))
                }
                formData.append("accountId", user.accountId.toString());
                formData.append("productId", JSON.stringify(productId));
                formData.append("productVariantId", JSON.stringify(productVariantId));
                formData.append("now", dayjs().toISOString());
                formData.append("star", JSON.stringify(rateValue));
                formData.append("content", JSON.stringify(content));
                formData.append("orderId", orderId.toString());
                for (let i = 0; i < productId.length; i++) {
                    if (rateValue[i] >= 4) {
                        addProductRecent(productId[i])
                    }
                }
                const result = await sendFeedbackApi(formData);
                if (result.code == 0) {
                    messageService.success(result.message);
                    setFeedbackOrderId((prev) => ([...prev, orderId]));
                    handleCancel();
                } else {
                    messageService.error(result.message)
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setModalLoading(false);
            }
        }
    }

    const updateFeedback = async () => {
        if (!checkValidate()) {
            const update = checkUpdate()
            if (update.isUpdate) {
                setModalLoading(true)
                try {
                    const formData = new FormData();
                    for (const item of videoRaw) {
                        formData.append(`${item.productId}=${item.productVariantId}`, item.video)
                    }
                    for (const item of imageRaw) {
                        item.image.forEach((i) => (
                            formData.append(`${item.productId}=${item.productVariantId}`, i)
                        ))
                    }
                    const currentMediaId = update.currentMediaId;
                    const removeMedia: number[] = firstMediaId.filter((item) => (!currentMediaId.includes(item)));
                    formData.append("accountId", user.accountId.toString());
                    formData.append("productId", JSON.stringify(productId));
                    formData.append("productVariantId", JSON.stringify(productVariantId));
                    formData.append("now", dayjs().toISOString());
                    formData.append("star", JSON.stringify(rateValue));
                    formData.append("content", JSON.stringify(content));
                    formData.append("orderId", orderId.toString());
                    formData.append("removeMedia", JSON.stringify(removeMedia));
                    formData.append("feedbackId", JSON.stringify(feedbackId));
                    formData.append("firstRate", JSON.stringify(firstRate));
                    for (let i = 0; i < productId.length; i++) {
                        if (rateValue[i] >= 4) {
                            addProductRecent(productId[i])
                        }
                    }
                    const result = await updateFeedbackApi(formData);
                    if (result.code == 0) {
                        messageService.success(result.message);
                        handleCancel();
                    } else {
                        messageService.error(result.message)
                    }
                } catch(e) {
                    console.log(e);
                    messageService.error("Xảy ra lỗi ở server");
                } finally {
                    setModalLoading(false);
                }
            } else {
                messageService.success("Cập nhật đánh giá thành công");
                handleCancel();
            }
        }
    }

    const handleCancel = () => {
        setRateValue([])
        setContent([])
        setvideoRaw([])
        setImageRaw([])
        setMedia([])
        setValidate([])
        setIsExpand(false)
        setOpenModal(false)
    }
    return(
        <>
            <Modal
                className="feedback-modal"
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đánh giá sản phẩm</span>}
                closable={true}
                open={openModal}
                onOk={() => {mode == "create" ? sendFeedback() : updateFeedback()}}
                onCancel={() => {handleCancel()}}
                okText="Gửi"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
                width={"1200px"}
                loading={skeletonLoading}
            >
                <Row style={{padding: "10px 20px 10px 0px", marginRight: "-24px", maxHeight: "500px", overflowY: "auto"}}>
                    {
                        name.map((item, index) => (
                            <Col key={index} span={24} style={{padding: "20px 0px", borderTop: `${index != 0 ? "1px solid rgba(0, 0, 0, 0.5)" : ""}`}}>
                                <Row>
                                    <Col span={12} style={{paddingRight: "20px"}}>
                                        <Row align={"top"}>
                                            <Col title={item} span={10} style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "10px"}}>
                                                <div style={{width: "80%", height: "200px", overflow: "hidden"}}>
                                                    <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={url[index]} />
                                                </div>
                                                <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                                                    <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center"}}>{item}</div>
                                                    <div style={{fontSize: "14px", color: "#8f8f8fff"}}>{color[index]}/{size[index]}</div>
                                                </div>
                                            </Col>
                                            <Col span={14}>
                                                <Row>
                                                    <Col span={24} style={{display: "flex", justifyContent: "center", paddingBottom: "20px"}}>
                                                        <Rate
                                                            value={rateValue[index]}
                                                            character={<Star stroke="none" fill="currentColor" size={30} />}
                                                            className="custom-rate"
                                                            onChange={(value) => {
                                                                setRateValue((prev) => (
                                                                    prev.map((itemChild, indexChild) => (indexChild == index ? value : itemChild))
                                                                ))
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col span={24} style={{paddingTop: "20pxs"}}>
                                                        <TextArea 
                                                            className="input-ant" 
                                                            placeholder="Nội dung đánh giá" 
                                                            status={`${validate[index] ? "error" : ""}`}
                                                            autoSize={{minRows: 6}} 
                                                            value={content[index]}
                                                            onChange={(event) => {
                                                                setValidate((prev) => (
                                                                    prev.map((itemChild, indexChild) => (indexChild == index ? false : itemChild))
                                                                ));
                                                                setContent((prev) => (
                                                                    prev.map((itemChild, indexChild) => (indexChild == index ? event.target.value : itemChild))
                                                                ))
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12} style={{paddingLeft: "20px"}}>
                                        <Row>
                                            <Col span={24} style={{paddingTop: "20px", paddingRight: "10px", display: "flex", justifyContent: "center", gap: "20px"}}>
                                                <div 
                                                    style={{display: "flex", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "10px 20px", cursor: "pointer", width: "fit-content", gap: "10px"}}
                                                    onClick={() => {videoClick(index)}}
                                                >
                                                    <Video size={30} strokeWidth={1} style={{opacity: 0.7}} />
                                                    <div>{`1 video (10MB)`}</div>
                                                    <input 
                                                        type="file" 
                                                        accept="video/*" 
                                                        style={{display: "none"}} 
                                                        ref={(element) => {videoRef.current[index] = element}} 
                                                        onChange={(event) => {
                                                            const file = event.target.files?.[0];
                                                            if (file) {
                                                                const fileSize = file.size / (1024 * 1024);
                                                                if (fileSize > maxSizeVideo) {
                                                                    messageService.error("Kíck thước video lớn hơn kích thước cho phép")
                                                                } else {
                                                                    const exist = videoRaw.find((itemChild) => (itemChild.productVariantId == productVariantId[index]))
                                                                    const url = URL.createObjectURL(file);
                                                                    if (exist) {
                                                                        setvideoRaw((prev) => (
                                                                            prev.map((itemChild) => (
                                                                                itemChild.productVariantId == productVariantId[index] ? 
                                                                                {
                                                                                    productId: productId[index], 
                                                                                    productVariantId: productVariantId[index], 
                                                                                    video: file
                                                                                } : itemChild
                                                                            ))
                                                                        ));
                                                                    } else {
                                                                        setvideoRaw((prev) => (
                                                                            [...prev, {
                                                                                productId: productId[index], 
                                                                                productVariantId: productVariantId[index], 
                                                                                video: file
                                                                            }]
                                                                        ))
                                                                    }
                                                                    const findMedia = media.find((item) => (item.productVariantId == productVariantId[index]));
                                                                    if (!findMedia) {
                                                                        setMedia((prev) => (
                                                                            [
                                                                                ...prev,
                                                                                {
                                                                                    productVariantId: productVariantId[index],
                                                                                    media: [{
                                                                                        url: url,
                                                                                        type: 2,
                                                                                        id: -1
                                                                                    }]
                                                                                }
                                                                            ]
                                                                        ))
                                                                    } else {
                                                                        setMedia((prev) => (
                                                                            prev.map((itemChild) => (
                                                                                itemChild.productVariantId == productVariantId[index] ?
                                                                                {
                                                                                    ...itemChild,
                                                                                    media: itemChild.media.find((i) => (i.type == 2)) ? itemChild.media.map((m) => (m.type == 2 ? {type: 2, url: url, id: -1} : m)) : [{type: 2, url: url, id: -1}, ...itemChild.media]
                                                                                } : itemChild
                                                                            ))
                                                                        ))
                                                                    }
                                                                }
                                                            }
                                                            event.target.value = "";
                                                        }}
                                                    />
                                                </div>
                                                <div 
                                                    style={{display: "flex", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "10px 20px", cursor: "pointer", width: "fit-content", gap: "10px"}}
                                                    onClick={() => {imageClick(index)}}
                                                >
                                                    <Image size={30} strokeWidth={1} style={{opacity: 0.7}} />
                                                    <div>{`5 hình ảnh (1MB)`}</div>
                                                    <input 
                                                        type="file" 
                                                        multiple={true}
                                                        accept="image/*" 
                                                        style={{display: "none"}} 
                                                        ref={(element) => {imageRef.current[index] = element}} 
                                                        onChange={(event) => {
                                                            const files = event.target.files;
                                                            if (files && files.length > 0) {
                                                                if (files.length > 5) {
                                                                    messageService.error("Bạn chỉ được chọn tối đa 5 ảnh");
                                                                } else {
                                                                    const urls: string[] = [];
                                                                    const raw: File[] = [];
                                                                    for (let i = 0; i < files.length; i++) {
                                                                        const file = files[i];
                                                                        const fileSize = file.size / (1024 * 1024);
                                                                        if (fileSize > maxSizeImage) {
                                                                            messageService.error("Kíck thước hình ảnh lớn hơn kích thước cho phép")
                                                                            continue;
                                                                        } else {
                                                                            const url = URL.createObjectURL(file);
                                                                            urls.push(url);
                                                                            raw.push(file);
                                                                        }
                                                                    }
                                                                    const findFile = imageRaw.find((itemChild) => (itemChild.productId == productId[index] && itemChild.productVariantId == productVariantId[index]))
                                                                    if (!findFile) {
                                                                        setImageRaw((prev) => (
                                                                            [...prev, {
                                                                                productId: productId[index],
                                                                                productVariantId: productVariantId[index],
                                                                                image: [...raw]
                                                                            }]
                                                                        ))
                                                                    } else {
                                                                        setImageRaw((prev) => (
                                                                            prev.map((itemChild) => (
                                                                                itemChild.productId == productId[index] && itemChild.productVariantId == productVariantId[index] ? 
                                                                                {
                                                                                    ...itemChild, 
                                                                                    image: itemChild.image.length + raw.length > 5 ? [...itemChild.image.slice(raw.length + itemChild.image.length - 5, itemChild.image.length), ...raw] : [...itemChild.image, ...raw]
                                                                                } : itemChild
                                                                            ))
                                                                        ))
                                                                    }
                                                                    const findMedia = media.find((item) => (item.productVariantId == productVariantId[index]));
                                                                    if (!findMedia) {
                                                                        setMedia((prev) => (
                                                                            [
                                                                                ...prev,
                                                                                {
                                                                                    productVariantId: productVariantId[index],
                                                                                    media: urls.map((itemChild) => ({
                                                                                        url: itemChild,
                                                                                        type: 1,
                                                                                        id: -1
                                                                                    }))
                                                                                }
                                                                            ]
                                                                        ))
                                                                    } else {
                                                                        setMedia((prev) => (
                                                                            prev.map((itemChild) => {
                                                                                const itemFilter = itemChild.media.filter((i) => (i.type == 1))
                                                                                const video = itemChild.media.filter((i) => (i.type == 2));
                                                                                return itemChild.productVariantId == productVariantId[index] ?
                                                                                ({
                                                                                    ...itemChild,
                                                                                    media: itemFilter.length + urls.length > 5 ? [...video, ...itemFilter.slice(urls.length + itemFilter.length - 5, itemFilter.length), ...urls.map((itemUrl) => ({url: itemUrl, type: 1, id: -1}))] : [...itemChild.media, ...urls.map((itemUrl) => ({url: itemUrl, type: 1, id: -1}))]
                                                                                }) : itemChild
                                                                            })
                                                                        ))
                                                                    }
                                                                }
                                                            }
                                                            setTimeout(() => {
                                                                event.target.value = "";
                                                            }, 0);
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={24} style={{paddingTop: "20px"}}>
                                                <Row gutter={[30, 20]}>
                                                    {
                                                        media.find((itemChild) => (itemChild.productVariantId == productVariantId[index]))?.media.map((itemMedia, indexMedia) => (
                                                            itemMedia.type == 2 ? (
                                                                <Col key={indexMedia} span={6} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                                                                    <div style={{width: "100%", height: "100px", overflow: "hidden"}}>
                                                                        <video style={{width: "100%", height: "100%", objectFit: `${isExpand ? "contain" : "cover"}`, borderRadius: "20px"}} controls={true}>
                                                                            <source src={itemMedia.url} type={videoRef.current[index]?.files?.[0]?.type} />
                                                                        </video>
                                                                    </div>
                                                                    <div 
                                                                        style={{position: "absolute", backgroundColor: "var(--color7)", top: "5px", right: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "3px", cursor: "pointer"}}
                                                                        onClick={() => {
                                                                            setMedia((prev) => (
                                                                                prev.map((itemChild) => (
                                                                                    itemChild.productVariantId == productVariantId[index] ?
                                                                                    {
                                                                                        ...itemChild,
                                                                                        media: itemChild.media.filter((_, indexM) => (indexM != indexMedia))
                                                                                    } : itemChild
                                                                                ))
                                                                            ))
                                                                            setvideoRaw((prev) => (
                                                                                prev.filter((i) => (i.productVariantId != productVariantId[index] && i.productId != productId[index]))
                                                                            ))
                                                                        }}
                                                                    >  
                                                                        <X size={22} strokeWidth={2} stroke="white" />
                                                                    </div>
                                                                </Col>
                                                            ) : (
                                                                <Col key={indexMedia} span={6} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                                                                    <div style={{width: "100%", height: "100px", overflow: "hidden"}}>
                                                                        <img style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px"}} src={itemMedia.url} />
                                                                    </div>
                                                                    <div 
                                                                        style={{position: "absolute", backgroundColor: "var(--color7)", top: "5px", right: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "3px", cursor: "pointer"}}
                                                                        onClick={() => {
                                                                            setMedia((prev) => (
                                                                                prev.map((itemChild) => (
                                                                                    itemChild.productVariantId == productVariantId[index] ?
                                                                                    {
                                                                                        ...itemChild,
                                                                                        media: itemChild.media.filter((_, indexM) => (indexM != indexMedia))
                                                                                    } : itemChild
                                                                                ))
                                                                            ))
                                                                            setImageRaw((prev) => (
                                                                                prev.map((itemChild) => (
                                                                                    itemChild.productId == productId[index] && itemChild.productVariantId == productVariantId[index] ?
                                                                                    {...itemChild, image: itemChild.image.filter((_, idx) => (idx != indexMedia))} : itemChild
                                                                                ))
                                                                            ))
                                                                        }}
                                                                    >  
                                                                        <X size={22} strokeWidth={2} stroke="white" />
                                                                    </div>
                                                                </Col>
                                                            )
                                                        ))
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        ))
                    }
                </Row>















                {/* <Row style={{padding: "20px 20px 20px 0px", marginRight: "-24px", maxHeight: "500px", overflowY: "auto"}}>
                    <Col span={24} style={{display: "flex", justifyContent: "center", paddingBottom: "20px"}}>
                        <Rate
                            value={rateValue}
                            character={<Star stroke="none" fill="currentColor" size={30} />}
                            className="custom-rate"
                            onChange={(value) => {
                                setRateValue(value)
                            }}
                        />
                    </Col>
                    <Col span={24} style={{paddingTop: "20pxs"}}>
                        <TextArea 
                            className="input-ant" 
                            placeholder="Nội dung đánh giá" 
                            status={`${validate ? "error" : ""}`}
                            autoSize={{minRows: 6}} 
                            value={content}
                            onChange={(event) => {
                                setValidate(false);
                                setContent(event.target.value)
                            }}
                        />
                    </Col>
                    <Col span={12} style={{paddingTop: "20px", paddingRight: "10px"}}>
                        <div 
                            style={{display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "20px 0px", cursor: "pointer"}}
                            onClick={() => {videoClick()}}
                        >
                            <FileVideo size={100} strokeWidth={1} style={{opacity: 0.3}} />
                            <div>Tải video lên</div>
                            <div style={{fontSize: "14px", color: "#afb6b5"}}>{`(Tối đa 1 video)`}</div>
                            <div style={{fontSize: "14px", color: "#afb6b5"}}>{`(Kích thước tối đa 10MB)`}</div>
                            <input 
                                type="file" 
                                accept="video/*" 
                                style={{display: "none"}} 
                                ref={videoRef} 
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        const fileSize = file.size / (1024 * 1024);
                                        if (fileSize > maxSizeVideo) {
                                            messageService.error("Kíck thước video lớn hơn kích thước cho phép")
                                        } else {
                                            setvideoRaw(file);
                                            const url = URL.createObjectURL(file);
                                            setMedia((prev) => {
                                                const removeVideo = prev.filter((item) => (item.type != 2));
                                                const addNewVideo = [{url: url, type: 2}, ...removeVideo];
                                                return addNewVideo;
                                            })
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={12} style={{paddingTop: "20px", paddingLeft: "10px"}}>
                        <div 
                            style={{display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "20px 0px", cursor: "pointer"}}
                            onClick={() => {imageClick()}}
                        >
                            <FileImage size={100} strokeWidth={1} style={{opacity: 0.3}} />
                            <div>Tải ảnh lên</div>
                            <div style={{fontSize: "14px", color: "#afb6b5"}}>{`(Tối đa 5 ảnh)`}</div>
                            <div style={{fontSize: "14px", color: "#afb6b5"}}>{`(Kích thước tối đa 1MB)`}</div>
                            <input 
                                type="file" 
                                multiple={true}
                                accept="image/*" 
                                style={{display: "none"}} 
                                ref={imageRef} 
                                onChange={(event) => {
                                    const files = event.target.files;
                                    if (files && files.length > 0) {
                                        if (files.length > 5) {
                                            messageService.error("Bạn chỉ được chọn tối đa 5 ảnh");
                                        } else {
                                            const urls: string[] = [];
                                            for (let i = 0; i < files.length; i++) {
                                                const file = files[i];
                                                const fileSize = file.size / (1024 * 1024);
                                                if (fileSize > maxSizeImage) {
                                                    messageService.error("Kíck thước hình ảnh lớn hơn kích thước cho phép")
                                                    continue;
                                                } else {
                                                    const url = URL.createObjectURL(file);
                                                    urls.push(url);
                                                    if (imageRaw.length == 5) {
                                                        setImageRaw((prev) => (
                                                            [...prev.slice(1, 5), file]
                                                        ))
                                                    } else {
                                                        setImageRaw((prev) => (
                                                            [...prev, file]
                                                        ))
                                                    }
                                                }
                                            }
                                            setMedia((prev) => {
                                                let newMedia: {url: string, type: number}[] = [];
                                                const imageExist = prev.filter((item) => (item.type == 1));
                                                if (imageExist.length == 5) {
                                                    const videoExist = prev.filter((item) => (item.type == 2));
                                                    newMedia = [...videoExist, ...imageExist.slice(urls.length, imageExist.length), ...urls.map((item) => ({url: item, type: 1}))]
                                                } else {
                                                    newMedia = [...prev, ...urls.map((item) => ({url: item, type: 1}))]
                                                }
                                                return newMedia;
                                            })
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={24} style={{paddingTop: "20px"}}>
                        <Row gutter={[30, 20]}>
                            {
                                media.map((item, index) => (
                                    item.type == 2 ? (
                                        <Col key={index} span={12} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                                            <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                                                <video style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px"}} controls={true}>
                                                    <source src={item.url} type={videoRef.current?.files?.[0].type} />
                                                </video>
                                            </div>
                                            <div 
                                                style={{position: "absolute", backgroundColor: "var(--color7)", top: "5px", right: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "3px", cursor: "pointer"}}
                                                onClick={() => {
                                                    setMedia((prev) => (
                                                        prev.filter((itemChild, indexChild) => (indexChild != index))
                                                    ))
                                                }}
                                            >  
                                                <X size={22} strokeWidth={2} stroke="white" />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col key={index} span={12} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                                            <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                                                <img style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px"}} src={item.url} />
                                            </div>
                                            <div 
                                                style={{position: "absolute", backgroundColor: "var(--color7)", top: "5px", right: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "3px", cursor: "pointer"}}
                                                onClick={() => {
                                                    setMedia((prev) => (
                                                        prev.filter((itemChild, indexChild) => (indexChild != index))
                                                    ))
                                                }}
                                            >  
                                                <X size={22} strokeWidth={2} stroke="white" />
                                            </div>
                                        </Col>
                                    )
                                ))
                            }
                        </Row>
                    </Col>
                </Row> */}
            </Modal>
            <LoadingModal 
                open={modalLoading}
                message="Đang gửi"
            />
        </>
    )
}

export default FeedbackModal;