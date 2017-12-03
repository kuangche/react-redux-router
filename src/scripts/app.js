/**
 * Created by anchao on 2015/12/7.
 */
import 'babel-polyfill'
import {
  $,
  React,
  ReactDOM,
  Provider,
  Router,
  storeCreateByReducer,
  createHistory,
  AppContainer
} from './common/Util'
import { reducers } from './main/reducers'
import RootRoutesView from './main/views/RootRoutesView'

const store = storeCreateByReducer(reducers)
const history = createHistory()
const oContainer = document.querySelector('#container')

class Main {
  init () {
    this.render(RootRoutesView)
    this.event()

    if(module.hot && process.env.NODE_ENV === 'development'){
      module.hot.accept('./main/views/RootRoutesView', () => {
        const NextComponent = require('./main/views/RootRoutesView').default; // eslint-disable-line
        this.render(NextComponent)
      });
    }
  }

  render(Componet){
    ReactDOM.render(
      <AppContainer warnings={false}>
        <Provider store={store}>
          <Router hashHistory={history}>
            <Componet/>
          </Router>
        </Provider>
      </AppContainer>,
      oContainer
    )
  }

  closeLoading (url) {
    const loadingInstance = dialog.getCurrent()
    // 记录每次的url地址作为关闭的唯一标识
    if (loadingInstance && loadingInstance.id === 'loadingdiv' && loadingInstance.url === url) {
      loadingInstance.close().remove()
    } else {

    }
  }

  event () {
    this.globalEvent()
    this.unloadModule()
  }

  globalEvent () {
    // 窗口尺寸变化时执行reload
    $(window).on('resize', function () {

    })

    // 全局loading画面及错误处理
    // 这里需要增加一个参数，阻止loading画面
    $(document).ajaxSend(function (event, jqXHR, ajaxOptions) {
      // 不需要loading画面的ajax请求在这里特殊处理一下
      let url = ajaxOptions.url
      let aForbidUrl = ['/bus/version/get\\?id=', '/bus/user/info']
      let reg = '^' + aForbidUrl.join('|')

      // get接口特殊，必须以^开始
      if (new RegExp(reg).test(url)) {
        return
      }

      // 如果没有loading画面，一个界面只有一个loading动画时
      let loadingInstance = dialog.getCurrent()
      if (loadingInstance == null || (loadingInstance && loadingInstance.id !== 'loadingDiv')) {
        loadingInstance = dialog.loading()
      }

      // 根据url作为key作为最后关闭loading画面的唯一标识
      loadingInstance.url = url
    }).ajaxSuccess((event, XMLHttpRequest, ajaxOptions) => {
      // 关闭Loading画面
      this.closeLoading(ajaxOptions.url)
      // 非法登录自动跳转到登录页
      // let result = JSON.parse(XMLHttpRequest.responseText).result;
      //
      // if(result.statusCode==540){
      //     if (dialog.get('Alert')) {
      //         dialog.get('Alert').close();
      //     }
      //
      //     location.hash = '#/';
      // }
    }).ajaxError((event, request, settings) => {
      // console.log("Error requesting page " + settings.url);
      // 关闭Loading画面
      this.closeLoading(settings.url)
      // cmd + ctr + space -->emoji
      dialog.alert('当前服务不可用😂！', 'warning')
    }).on('click', function (e) {

    }).on('contextmenu', function () {

    })
  }

  unloadModule () {
    window.addEventListener('beforeunload', e => {
      const msg = '确定要离开吗？'
      e.returnValue = msg
      console.log(msg)
      return msg
    }, false)
  }
}

new Main().init()
