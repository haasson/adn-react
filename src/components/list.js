import React from 'react'
import ListItem from './list-item'

export default class extends React.Component {

   state = {
      itemsToShow: 3
   }

   itemsToAdd = 3;

   componentDidUpdate(nextProps) {
      if (this.props.list != nextProps.list) {
         let itemsToShow = this.itemsToAdd;
         this.setState(() => { return { itemsToShow } });
      }
   }

   showMore = () => {
      let itemsToShow = this.state.itemsToShow;
      itemsToShow += this.itemsToAdd;
      this.setState(() => { return { itemsToShow } });
   }

   render() {
      let { list, onCenter } = this.props;
      let { itemsToShow } = this.state;
      let elements = list
         .sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
         })
         .map(item => {
            return (
               <li className="list__item" key={item.id} onClick={() => onCenter(item.id)}>
                  <ListItem
                     item={item}
                  />
               </li>
            )
         });

      let button = (
            <div className="list__more">
               <svg className="icon list__icon-line">
                  <use xlinkHref="assets/svg-sprite/icons.svg#line"></use>
               </svg>
               <div className="list__btn-wrap">
                  <button className="button list__btn" onClick={this.showMore}>
                     Показать еще
                  </button>
               </div>
            </div>
         )


      return (
         <div className="wrapper">
            <ul className="list__items">
               {elements.slice(0, itemsToShow)}
            </ul>
            {itemsToShow < elements.length ? button : null}
         </div>
      )
   }
}