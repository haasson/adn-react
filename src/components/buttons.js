import React from 'react'

export default class extends React.Component {

   render() {

      let { setMode, mode } = this.props;

      let mapBtnClasses = "button toggle-mode__btn toggle-mode__btn_map";
      let listBtnClasses = "button toggle-mode__btn toggle-mode__btn_list";

      switch (mode) {
         case 'map':
            mapBtnClasses += " active-btn"
            break;
         case 'list':
            listBtnClasses += " active-btn"
            break;
      }

      return (
         <div className="map__buttons toggle-mode">
            <button className={mapBtnClasses} onClick={() => setMode('map')}>
               На карте
         </button>
            <button className={listBtnClasses} onClick={() => setMode('list')}>
               Списком
         </button>
         </div>
      )
   }
}