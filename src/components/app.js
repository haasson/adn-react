import React from 'react'

import data from '../data.json'

import MyMap from './map';
import Counter from './counter';
import List from './list';
import Find from './find';
import Filter from './filter';
import Buttons from './buttons';

export default class extends React.Component {

   state = {
      mode: 'map',
      features: [],
      visible: [],
      targetID: null,
      term: '',
      filter: 'Все теремки',
      count: {},
   };


   // При монтировании компонента записываем в state данные
   componentDidMount() {
      let count = {all: 0, type1: 0, type2: 0, type3: 0, type4: 0}
      let features = data.features.map(obj => {
         count.all++;
         switch (obj.type) {
            case 'Ресторан с залом':
               count.type1++;
               break;
            case 'Ресторанный дворик':
               count.type2++;
               break;
            case 'Кафе':
               count.type3++;
               break;
            case 'Уличный киоск':
               count.type4++;
               break;
            default:
               break;
         }

         let metroList = obj.metro.map(metro => {
            return `<li class="balloon__list-item balloon__list-item_${metro.color}">${metro.name}</li>`
         })
         return {
            "type": "Feature",
            "id": obj.id,
            "geometry": {
               "type": "Point",
               "coordinates": [
                  obj.latitude,
                  obj.longitude
               ]
            },
            "properties": {
               "balloonContent": `
                  <div class="balloon">
                  <h3 class="balloon__title">${obj.name}</h3>
                  <p class="balloon__address">${obj.address}</p>
                  <ul class="balloon__list">
                     ${metroList.join('')}
                  </ul>
                  <div class="balloon__about">
                     <span class="balloon__about-item balloon__about-item_type">${obj.type}</span>
                     <span class="balloon__about-item balloon__about-item_work">${obj.work[0]} <span class="nowrap">с ${obj.work[1]} до ${obj.work[2]}</span></span>
                  </div>
                  <button class="button balloon__btn">Подробнее</button>
                  </div>
               `,
            },
            "name": obj.name,
            "address": obj.address,
            "metro": obj.metro,
            "class": obj.type,
            "work": obj.work
         }
      });
      
      this.setState(() => {
         return { features, count }
      })
   }


   setDistance = (features) => {
      this.setState(() => { return { features } });
   }

   setVisible = (visible) => {
      this.setState(() => { return { visible } });
   }

   setCenter = (targetID) => {
      this.setState(() => { return { targetID, mode: 'map' } });
   }

   setTerm = (term) => {
      this.setState(() => { return { term } });
   }

   setMode = (mode) => {
      this.setState(() => { return { mode } });
   }

   setFilter = (e) => {
      let filter = e.value;
      this.setState(() => { return { filter } });
   }

   search = (features = this.state.features) => {
      let { term } = this.state

      return features.filter(feature => {
         let str = `${feature.address}, ${feature.name}`;
         return str.toLowerCase().indexOf(term.toLowerCase()) > -1
      })
   }

   filter = () => {
      let { filter, features } = this.state;

      if (filter === 'Все теремки') return features;

      return features.filter(feature => {
         return feature.class === filter
      })
   }


   render() {
      const { count, visible, targetID, filter, mode, term } = this.state;

      let filteredFeatures = this.filter()
      let searchList = this.search(filteredFeatures)
      let listToShow = filteredFeatures.filter(feature => visible.includes(feature.id))

      let mapClasses = "map-block__body map";
      let listClasses = "map-block__list list";
      
      switch (mode) {
         case 'map':
            listClasses += " hidden"
            break;
         case 'list':
            mapClasses += " hidden"
            break;
      }


      return (
         <div className='map-block'>
            <div className="map-block__navbar">
               <div className="wrapper">
                  <div className="map-block__navbar-content">
                     <Find
                        onSearch={searchList}
                        setTerm={this.setTerm}
                        onCenter={this.setCenter}
                     />
                     <Filter
                        setFilter={this.setFilter}
                        count={count}
                     />
                     <Buttons
                        setMode={this.setMode}
                        mode={mode}
                     />
                  </div>
               </div>
            </div>
            <div className="map-block__content">
               <div className={mapClasses}>
                  <MyMap
                     features={filteredFeatures}
                     setDistance={this.setDistance}
                     setVisible={this.setVisible}
                     filter={filter}
                     visible={visible}
                     targetID={targetID}
                     term={term}
                     mode={mode}
                  />
                  <Counter
                     visibleCount={visible.length}
                     total={filteredFeatures.length}
                  />
               </div>
               <div className={listClasses}>
                  <List
                     list={listToShow}
                     onCenter={this.setCenter}
                  />
               </div>
            </div>
         </div>
      )
   }
}