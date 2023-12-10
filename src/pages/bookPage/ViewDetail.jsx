import { Row, Col, Rate, Divider, Button } from 'antd';
import './bookPage.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './bookLoader';
import { handleAddBookAction } from '../../redux/order/orderSlice';
import { current } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ViewDetail = (props) => {
    const dispatch = useDispatch();
    const dataBook = props.dataBook;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState(1);

    const refGallery = useRef(null);

    const images = dataBook?.items ?? [];

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
        // refGallery?.current?.fullScreen()
    }

    const priceBook = dataBook?.price ?? 0;

    // console.log("DataBook: ", dataBook)

    const handleChangeButton = (type) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === "PLUS") {
            if (currentQuantity === +dataBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    }
    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }
    const handleAddToCart = (quantity, book) => {
        dispatch(handleAddBookAction({ quantity, detail: book, _id: book._id }))
        setCurrentQuantity(0);
    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook._id ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='author'>Author: <a href='#'>{dataBook.author}</a> </div>
                                    <div className='title'><h4>{dataBook.mainText}</h4></div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Sold {dataBook.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceBook)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left-delivery'>Delivery</span>
                                            <span className='right-delivery'>Free shipping</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-delivery'>Quantity</span>
                                        <span className='right-delivery'>
                                            <button
                                                onClick={() => handleChangeButton('MINUS')}
                                            ><MinusOutlined /></button>
                                            <input
                                                onChange={(event) => handleChangeInput(event.target.value)}
                                                value={currentQuantity}
                                            />
                                            <button
                                                onClick={() => handleChangeButton('PLUS')}
                                            ><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button
                                            className='cart'
                                            onClick={() => handleAddToCart(currentQuantity, dataBook)}
                                        >
                                            <BsCartPlus className='icon-cart' />
                                            <span>Add to cart</span>
                                        </button>
                                        <button className='now'>Buy now</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        :
                        <BookLoader />
                    }
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook.mainText}
            />
        </div>
    )
}

export default ViewDetail;