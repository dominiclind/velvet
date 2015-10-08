const riot = require('riot');
const IScroll = require('iscroll');

exports = module.exports = riot.tag('list-view', require('./list-view.html'), function editor (opts) {
  this.on('mount', function () {
    const iscroll = new IScroll(this.root, {
      mouseWheel: true,
      scrollbars: true
    });

    setTimeout(function () {
      iscroll.refresh(); // next tick update size...
    }, 0);
  });
});
