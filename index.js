// Import stylesheets
import './style.css';

import { home } from './home.js';
import { pdp } from './pdp.js';
import { getProduct } from './product.js';
import { handleClick } from './handleClick.js';

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import 'instantsearch.css/themes/satellite.css';

import {
  configure,
  hits,
  pagination,
  panel,
  refinementList,
  searchBox,
  poweredBy,
  clearRefinements,
  currentRefinements,
} from 'instantsearch.js/es/widgets';

const searchClient = algoliasearch(
  'YSMG3EWZL9',
  'f6c407cdd05ff53d3de47152fdb17ab3'
);

const search = instantsearch({
  indexName: 'Sending Events',
  searchClient,
  routing: true,
  // Turn on insights
});

const routes = {
  '/': home,
  pdp: pdp,
};

const appDiv = document.getElementById('app');
const renderContent = (route) => {
  search.addWidgets([
    poweredBy({
      container: '#powered-by',
    }),
  ]);
  if (route == '/') {
    // Render the search page
    appDiv.innerHTML = routes[route].content;
    search.addWidgets([
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#hits',
        templates: {
          item: (hit, { html, components }) => html`
          <article>
            <h2>${components.Highlight({
              hit,
              attribute: 'name',
            })}</h2>
            <p>${components.Highlight({ hit, attribute: 'description' })}</p>
            <a href="/${hit.objectID}" class="button">More details</a>
          </article>
          `,
        },
      }),
      configure({
        hitsPerPage: 8,
      }),
      panel({
        templates: { header: 'brand' },
      })(refinementList)({
        container: '#brand-list',
        attribute: 'brand',
      }),
      clearRefinements({
        container: '#clear-refinements',
      }),
      currentRefinements({
        container: '#current-refinements',
      }),
      pagination({
        container: '#pagination',
      }),
    ]);
  } else {
    // Render a product detail page
    appDiv.innerHTML = routes['pdp'].content;

    // We'll need the queryID

    // This should actually be retrieving from your DB
    const objectID = route.substring(1);
    const index = searchClient.initIndex('Sending Events');
    index.search(objectID).then(({ hits }) => {
      const product = hits[0];
      let elem = document.createElement('img');
      elem.src = product.image;
      document.getElementById('productImage').appendChild(elem);
      document.getElementById('productName').innerHTML = product.name;
      document.getElementById('productDescription').innerHTML =
        product.description;
      document.getElementById('productPrice').innerHTML = `\$${product.price}`;
      const cartButton = document.getElementById('cartButton');
      cartButton.addEventListener('click', handleClick, false);
    });
  }
};

const registerBrowserBackAndForth = () => {
  window.onpopstate = function (e) {
    const route = window.location.pathname;
    renderContent(route);
  };
};

const renderInitialPage = () => {
  const route = window.location.pathname;
  renderContent(route);
};

(function bootup() {
  registerBrowserBackAndForth();
  renderInitialPage();
})();

search.start();
