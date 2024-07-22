import React ,{useEffect,useState} from 'react'
import { Button, Col, Row,Tooltip } from 'antd'
import { BellOutlined, ContainerOutlined, PullRequestOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StageTimeLineService from '../../services/StageTimeLineService'

const FeedbackDash = () => {
    const navigate = useNavigate();
    const [showFeedbackButton, setShowFeedbackButton] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [peerFeedbackTimeline, setPeerFeedbackTimeline] = useState(null);


    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };
    const fetchTimelinesByDate = async () => {
        const currentDateTime = new Date().toISOString().slice(0, 19); 
        try {
            const timelines = await StageTimeLineService.getTimelinesByDate(currentDateTime);
            console.log('Fetched Timelines:', timelines);

            const hasFeedbackTimeline = timelines.some(timeline => timeline.stageName === 'PEER_FEEDBACK');
            setShowFeedbackButton(hasFeedbackTimeline); 
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };
    const fetchTimelines = async () => {
        try {
            const timelines = await StageTimeLineService.getAllStagesWithTimeline();
            console.log('Fetched Timelines:', timelines);

            const peerFeedbackTimeline = timelines.find(timeline => timeline.stageName === 'PEER_FEEDBACK');
            if (peerFeedbackTimeline) {
                setPeerFeedbackTimeline(peerFeedbackTimeline);
                setShowFeedbackButton(true); 
            } else {
                setShowFeedbackButton(false);
            }
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };

    useEffect(() => {
        fetchTimelinesByDate(); 
        fetchTimelines();
    }, []);

    const peerFeedback = () => {
       navigate('/feedback/peer')
    }
    const selfFeedback = () => {
       navigate('/feedback/self')
    }
    const managerFeedback = () => {
       navigate('/feedback/manager')
    }
    const provideFeedback = () => {
        navigate('/feedback/provide')
    }
    const requestFeedback = () => {
        navigate('/feedback/request')
    }
    return (
        <>
            <h2 >Feedback</h2>
            <div className='pt-4 container mt-xxl-5 pe-xxl-5 d-flex flex-column justify-content-center align-items-center'>
            <Row gutter={16} className="mb-3 justify-content-between">
                <Col span={6} className=''>
                    <Button className='transition-card' onClick={() => peerFeedback('peer')}>
                        <span><ContainerOutlined style={{ fontSize: '50px' }} /></span>
                        <h5 className='mt-2'>Peer Feedback</h5>
                    </Button>
                </Col>
                <Col span={6}>
                    <Button className='transition-card' onClick={() => selfFeedback('self')}>
                        <span><ContainerOutlined style={{ fontSize: '50px' }} /></span>
                        <h5 className='mt-2'>Self Feedback</h5>
                    </Button>
                </Col>
                <Col span={6}>
                    <Button className='transition-card' onClick={() => managerFeedback('manager')}>
                        <span><ContainerOutlined style={{ fontSize: '50px' }} /></span>
                        <h5 className='mt-2'>Manager Feedback</h5>
                    </Button>
                </Col>
            </Row>
            <Row gutter={16} className="mt-lg-4 me-5 justify-content-around ">
                    <Col span={6}>
                        <Tooltip
                            title={
                                showFeedbackButton && peerFeedbackTimeline ? 
                                `` :
                                `Provide Feedback (Active from ${formatDate(peerFeedbackTimeline?.startDate)} to ${formatDate(peerFeedbackTimeline?.endDate)})`
                            }
                            overlayClassName="custom-tooltip"
                        >
                            <Button
                                className='transition-card me-lg-5'
                                onClick={provideFeedback}
                                disabled={!showFeedbackButton}
                                onMouseEnter={() => setTooltipVisible(true)}
                                onMouseLeave={() => setTooltipVisible(false)}
                            >
                                <span><BellOutlined style={{ fontSize: '50px' }} /></span>
                                <h5 className='mt-2'>Provide Feedback</h5>
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        <Tooltip
                            title={
                                showFeedbackButton && peerFeedbackTimeline ? 
                                `` :
                                `Request Feedback (Active from ${formatDate(peerFeedbackTimeline?.startDate)} to ${formatDate(peerFeedbackTimeline?.endDate)})`
                            }
                            overlayClassName="custom-tooltip"
                        >
                            <Button
                                className='transition-card ms-2'
                                onClick={requestFeedback}
                                disabled={!showFeedbackButton}
                                onMouseEnter={() => setTooltipVisible(true)}
                                onMouseLeave={() => setTooltipVisible(false)}
                            >
                                <span><PullRequestOutlined style={{ fontSize: '50px' }} /></span>
                                <h5 className='mt-2'>Request Feedback</h5>
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default FeedbackDash;