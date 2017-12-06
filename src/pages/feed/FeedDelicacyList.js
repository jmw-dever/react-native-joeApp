/**
 * Created by ljunb on 2016/11/19.
 * 逛吃-知识
 */
import React, {PureComponent} from "react";
import {ListView, RefreshControl, StyleSheet, View} from "react-native";
import {observer} from "mobx-react/native";
import {reaction} from "mobx";
import Loading from "../../components/Loading";
import LoadMoreFooter from "../../components/LoadMoreFooter";
import MessageInfo from "../../components/FeedSingleImageCell";
import Toast from "react-native-easy-toast";
import FeedBaseStore from "../../store/feedBaseStore";

@observer
export default class FeedDelicacyList extends PureComponent {


    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.listurl = props.listurl
        this.moduleId = props.moduleId
        this.delicacyListStore = new FeedBaseStore(this.moduleId,this.listurl)
    }

    componentDidMount() {
        reaction(
            () => this.delicacyListStore.page,
            () => this.delicacyListStore.fetchFeedList()
        );
    }

    componentWillReact() {
        const {errorMsg} = this.delicacyListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <DelicacyItem onPress={this._onPressCell} feed={feed}/>

    _onRefresh = () => {
        this.delicacyListStore.isRefreshing = true;
        this.delicacyListStore.fetchFeedList()
    };

    _onEndReach = () => {
        if(!this.delicacyListStore.isNoMore){
            this.delicacyListStore.page++
        }
    }

    _renderFooter = () => <LoadMoreFooter isNoMore={this.delicacyListStore.isNoMore}/>

    _onPressCell = feed => {
        this.props.navigator.push({
            id: 'FeedDetail',
            passProps: {feed}
        })
    }

    render() {
        const {isRefreshing, isFetching, feedList} = this.delicacyListStore
        return (
            <View style={styles.listView}>
                {!isFetching &&
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(feedList.slice(0))}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    enableEmptySections
                    initialListSize={3}
                    onScroll={this._onScroll}
                    onEndReached={this._onEndReach}
                    onEndReachedThreshold={30}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                        />
                    }
                />
                }
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class DelicacyItem extends PureComponent {

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func
    }

    state = {
        isTrue: true
    }

    _onPress = () => {
        const {feed, onPress} = this.props
        const {isTrue} = this.state
        onPress && onPress(feed)
        feed.viewCount = 0
        this.setState({isTrue: !isTrue});
    }

    render() {
        const {feed: {title,content, cardImg, publisher, type,createTime}} = this.props
        const cellData = {title,content, cardImg, publisher,type,createTime}
        return <MessageInfo {...cellData} onPress={this._onPress} isTrue={this.state.isTrue}/>
        //return <FeedMultiImageCell {...cellData} onPress={this._onPress}/>
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
})