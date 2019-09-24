import React from "react";
import { YMaps, Map, ObjectManager } from "react-yandex-maps";
import $ from 'jquery'

export default class extends React.Component {

   state = {
      iconContentTemplate: null,
      balloonContentTemplate: null,
      MyBalloonLayout: null,
   }

   objectManager = React.createRef();
   map = React.createRef();
   ymaps = React.createRef();

   shouldComponentUpdate(nextProps, nextState) {
      if (this.props.visible !== nextProps.visible) return false
      if (this.props.term !== nextProps.term) return false
      if (this.props.targetID !== nextProps.targetID) this.setCenter(nextProps.targetID)
      return true
   }

   componentDidUpdate() {
      this.getVisibleObjects()
   }

   // Создаём шаблон для содержимого кластера
   createTemplateLayoutFactory = (ymaps) => {
      const { iconContentTemplate, balloonContentTemplate, MyBalloonLayout } = this.state;
      if (ymaps && !iconContentTemplate) {
         this.setState({
            iconContentTemplate: ymaps.current.templateLayoutFactory.createClass(
               '<div class="cluster"><div class="cluster-inner">{{ properties.geoObjects.length }}</div></div>'
            ),
         });
      }
      if (ymaps && !balloonContentTemplate) {
         this.setState({
            balloonContentTemplate: ymaps.current.templateLayoutFactory.createClass(
               `<div class="container text-white"><a class="close-balloon"> 
                  <svg class="icon balloon__icon_close">
                     <use xlink:href="assets/svg-sprite/icons.svg#desktop-close"></use>
                  </svg></a>$[properties.balloonContent]</div>`
            ),
         });
      }
      if (ymaps && !MyBalloonLayout) {
         this.setState({
            MyBalloonLayout: ymaps.current.templateLayoutFactory.createClass(
               ' <div class="popover top">' +
               ' <div class="arrow"> </div>' +
               ' <div class="popover-inner">' +
               '$[[options.contentLayout observeSize minWidth=235 maxWidth=1200 maxHeight=350]]' +
               ' </div>' +
               ' </div>',
               {

                  // * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                  build: function () {
                     this.constructor.superclass.build.call(this);
                     this._$element = $('.popover', this.getParentElement());
                     this.applyElementOffset();
                     this._$element.find('.close-balloon')
                        .on('click', $.proxy(this.onCloseClick, this));
                  },

                  // * Удаляет содержимое макета из DOM.
                  clear: function () {
                     this._$element.find('.close-balloon')
                        .off('click');
                     this.constructor.superclass.clear.call(this);
                  },

                  // * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                  onSublayoutSizeChange: function () {
                     // MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                     if (!this._isElement(this._$element)) return;
                     this.applyElementOffset();
                     this.events.fire('shapechange');
                  },

                  // * Сдвигаем балун, чтобы середина указывала на точку привязки.
                  applyElementOffset: function () {
                     this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                     });
                  },

                  // * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                  onCloseClick: function (e) {
                     e.preventDefault();
                     this.events.fire('userclose');
                  },

                  // * Используется для автопозиционирования (balloonAutoPan).
                  // * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                  getShape: function () {
                     // if (!this._isElement(this._$element)) {
                     //    console.log(MyBalloonLayout)
                     //    return MyBalloonLayout.superclass.getShape.call(this);
                     // }
                     var position = this._$element.position();
                     return new ymaps.current.shape.Rectangle(new ymaps.current.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                           position.left + this._$element[0].offsetWidth,
                           position.top + this._$element[0].offsetHeight]
                     ]));
                  },

                  // * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                  _isElement: function (element) {
                     return element && element[0] && element.find('.arrow')[0];
                  }
               }
            ),
         });
      }
   };

   getVisibleObjects = () => {
      let visible = [];

      if (this.objectManager.current) {
         this.objectManager.current.objects.each(obj => {
            const isShown = this.ymaps.current.util.bounds.containsPoint(
               this.map.current.getBounds(),
               obj.geometry.coordinates
            );

            if (isShown) visible.push(obj.id);
         });
      }
      this.props.setVisible(visible)
   };

   getUserLocation = (ymaps, map) => {
      ymaps.current.geolocation.get({
         provider: 'yandex',
      }).then(result => {
         // Красным цветом пометим положение, вычисленное через ip.
         result.geoObjects.options.set('preset', 'islands#redCircleIcon');
         result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение'
         });

         map.current.geoObjects.add(result.geoObjects);
         
         this.checkDistance(map.current, result.geoObjects.position);
         this.getVisibleObjects();

         map.current.panTo(result.geoObjects.position, {
            duration: 500
         });
      });
   }

   checkDistance = (map, location) => {
      let { features } = this.props;
      let coordSystem = map.options.get('projection').getCoordSystem();

      let newFeatures = features.map(feature => {
         let itemCoords = feature.geometry.coordinates;
         let distance = coordSystem.getDistance(location, itemCoords);
         return { ...feature, distance }
      });
      
      this.props.setDistance(newFeatures)
   }

   setCenter = (ID) => {
      let objects = this.objectManager.current.objects._objectsById
      let objectState = this.objectManager.current.getObjectState(objects[ID].id);
      let coords = objects[ID].geometry.coordinates

      if (coords) {
         this.map.current.panTo(coords, {
            duration: 500
         });
         setTimeout(() => {
            if (objectState.found) {
               this.objectManager.current.objects.balloon.open(objects[ID].id);
            }
         }, 510);
      }
   }



   render() {
      let { features, mode } = this.props;
      let { iconContentTemplate, balloonContentTemplate, MyBalloonLayout } = this.state

      return (
         <YMaps query={{ apikey: '16a7200b-59ee-4cd5-b5f6-656e073492b9', lang: "ru_RU", load: "package.full" }}>
            <Map
               instanceRef={this.map}
               onBoundsChange={mode === 'map' ? this.getVisibleObjects : null}
               onLoad={ymapsInstance => {
                  this.ymaps.current = ymapsInstance;
                  this.createTemplateLayoutFactory(this.ymaps);
                  this.getUserLocation(this.ymaps, this.map);
               }}
               modules={["util.bounds", 'control.ZoomControl', "templateLayoutFactory", "layout.ImageWithContent"]}
               width='100%' height='100%'
               defaultState={{
                  center: [53.36, 83.67],
                  zoom: 12,
                  behaviors: ['drag'],
                  controls: ['zoomControl'],
               }}
            >
               <ObjectManager
                  instanceRef={this.objectManager}
                  options={{
                     clusterize: true,
                     gridSize: 32
                  }}
                  objects={{
                     openBalloonOnClick: true,
                     iconLayout: "default#image",
                     iconImageHref: "./assets/svg/single-single.svg",
                     iconImageSize: [50, 50],
                     iconImageOffset: [-25, -25],
                     balloonLayout: MyBalloonLayout,
                     balloonContentLayout: balloonContentTemplate,
                     balloonPanelMaxMapArea: 0,
                     hideIconOnBalloonOpen: false,
                     balloonOffset: [-136, -151]
                  }}
                  clusters={{
                     clusterDisableClickZoom: false,
                     clusterIconLayout: "default#imageWithContent",
                     clusterIconImageHref: "./assets/svg/claster-single.svg",
                     clusterIconContentLayout: iconContentTemplate,
                     clusterIconImageSize: [50, 50],
                     clusterIconImageOffset: [-25, -25],
                  }}
                  features={{
                     type: 'FeatureCollection',
                     features: features
                  }}
                  modules={[
                     'objectManager.addon.objectsBalloon',
                     'objectManager.addon.objectsHint',
                  ]}
               />
            </Map>
         </YMaps>
      );
   }
}



