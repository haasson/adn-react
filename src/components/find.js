import React from 'react'

export default class extends React.Component {

   state = {
      term: '',
      dropdown: false
   }

   setValue = (e) => {
      const term = e.target.value;
      this.setState({ term })
      this.props.setTerm(term)
   }

   toggleDropdown = () => {
      setTimeout(() => {
         this.setState(() => { return { dropdown: !this.state.dropdown } });
      }, 100);
   }

   Dropdown = () => {
      if (this.state.term.length > 0) {
         
         let addresses =  this.props.onSearch.map(item => {
            let str = `${item.address}, ${item.name}`;
            return (
               <li className="search__item" key={item.id} onClick={() => this.props.onCenter(item.id)}>
                  {str}
               </li>
            )
         });

         return addresses.length === 0 ? 
            (<li className="search__item">
                  Нет совпадений...
               </li>)
         : addresses
      }
      else return ''
   }

   render() {
      
      let classes = this.state.term.length === 0 || !this.state.dropdown ? "search__dropdown hidden" : "search__dropdown"

      return (
         <div className="map__searchblock search">
            <input
               className="search__input"
               type="text"
               placeholder='Найти по адресу'
               value={this.state.term}
               onChange={this.setValue}
               onBlur={this.toggleDropdown}
               onFocus={this.toggleDropdown}
            />
            <ul className={classes}>
               {this.state.dropdown ? <this.Dropdown/> : null}
            </ul>
            <svg className="icon search__icon-search">
               <use xlinkHref="assets/svg-sprite/icons.svg#search"></use>
            </svg>
         </div>
      )
   }
}