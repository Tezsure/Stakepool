import React from 'react';
import stakeing from '../../../assets/images/stakeing.png'

const StackeingOptions = (props) => {
  return(
    <section className="container stakeing-options-container">
      <div className="section-heading-container">
        <h2 className="section-heading">Stakeing Options</h2>
        <button className="see-all-options-btn">See All</button>
      </div>

      <ul className="stakeing-options-list">
        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>

        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>
        <li className="stakeing-option-item">
          <div className="stakeing-option">
            <div className="stakeing-option-img-container">
              <img src={stakeing} class="stakeing-option-img" alt="Stakeing Option" />
            </div>
            <div className="predicted-price">
              Predicted Price Below $3.04
            </div>
          </div>
        </li>
      </ul>
    </section>
  )
}

export default StackeingOptions;