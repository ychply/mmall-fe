var webpack            = require("webpack");
// 引入css 单独打包插件
var ExtractTextPlugin  = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin  = require('html-webpack-plugin')
// 环境变量配置，dev / online  开发与线上环境
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';


var getHtmlConfig = function(name){ //获取html-webpack-plugin 参数的方法
	return {
		template :'./src/view/'+name+'.html',//生成的新的html文件所依赖的模板
  	filename :'view/'+name+'.html',//生成的新的html文件的名字
  	injecg   :true,
  	hash     :true,
  	chunks   :['common',name],
	}
}

var config = {
  entry:{
  	'common' :[__dirname + "/src/page/common/index.js"],
  	'index'  :[__dirname + "/src/page/index/index.js"],
  	'login'  :[__dirname + "/src/page/login/index.js"],
  }  ,
  output: {
    path       : __dirname + "/dist",//打包后的文件存放的地方
    publicPath : '/dist',
    filename   : "js/[name].js"//打包后输出文件的文件名
  },
  module: {
          loaders:[
               { test:/\.css$/, loader:ExtractTextPlugin.extract('style-loader', 'css-loader') }, //css 单独打包
               { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'file-loader?name=resource/[name].[ext]'}
          ]
    },
    resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
  externals : {//引入外部的变量
  	'jquery' : 'window.jQuery'
  },
  plugins: [//使用插件
  //独立通用js模版 
  new webpack.optimize.CommonsChunkPlugin({   //导出公共部分为base.js
  	name     : 'common',
  	filename : "js/base.js"
  }),
  //把css单独打包到css文件夹下
  new ExtractTextPlugin('css/[name].css'),  // 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
  //html模版的处理
//new HtmlWebpackPlugin({
//	template :'./src/view/index.html',//生成的新的html文件所依赖的模板
//	filename :'view/index.html',//生成的新的html文件的名字
//	injecg   :true,
//	hash     :true,
//	chunks   :['common','index'],
//})
      new HtmlWebpackPlugin(getHtmlConfig('index')),//用方法来传参数，减少代码
      new HtmlWebpackPlugin(getHtmlConfig('login'))
  ]
};

//判断是开发环境还是线上环境
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8082/');
}
module.exports = config;
