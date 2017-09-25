/**
 * React component that displays the table of feature toggles
 *
 * @author    Muhammad Najib <mnajib@wayfair.com>
 * @copyright 2017 Wayfair LLC - All rights reserved
 */
define('feature_toggle_list_component', [
    'react',
    'admin_table',
    '@styles/feature_toggles/feature_toggles_list_all',
    'feature_toggle_history_modal',
    'admin_button',
    'moment',
    'admin_alert',
    'admin_float_label_input'
  ],
  function(React, Table, style, HistoryButton, Button, Moment, Alert, TextInput) {
    'use strict';
    const { PropTypes } = React;
    /**
     * Creates view module of list view of Feature Toggles tool
     *
     * @param row
     */
    const getHistoryButton = row => (
      <span>
        <HistoryButton
          name={row.row.name}
          featureID={row.row.history}
        />
      </span>
    );
    class FeatureToggleListComponent extends React.Component {
      static propTypes = {
        is_valid_deploy_time: PropTypes.bool,
        feature_data: PropTypes.string
      };
      constructor(props) {
        super(props);
        const columns = [
          {
            Header: 'Release Date',
            accessor: 'date_released',
            style: {minWidth: 96, minHeight: 77},
            headerStyle: {minWidth: 96}
          },
          {
            Header: 'Name',
            accessor: 'name',
            style: {minWidth: 321, minHeight: 77},
            headerStyle: {minWidth: 321},
            Cell: (row) => (
              <a
                className ="wfa_link"
                data-name={row.row.name}
                href={'/v/feature/edit_react?id=' + encodeURIComponent(row.row.history)}
              >
                {row.row.name}
              </a>
            )
          },
          {
            Header: 'Group',
            accessor: 'group',
            style: {minWidth: 63, minHeight: 77},
            headerStyle: {minWidth: 63}
          },
          {
            Header: 'Description',
            accessor: 'description_html',
            headerStyle: {minWidth:200},
            style: {minWidth: 200, minHeight: 77, textAlign: 'center'}
          },
          {
            Header: 'Default Status',
            accessor: 'default_status',
            headerStyle: {minWidth: 80},
            style: {minWidth: 80, minHeight: 77, textAlign: 'center'}
          },
          {
            Header: 'Detailed Status',
            accessor: 'detailed_status',
            headerStyle: {minWidth: 230},
            style: {minWidth: 230, minHeight: 77}
          },
          {
            Header: 'Last Updated',
            accessor: 'date_updated',
            style: {minWidth: 96, minHeight: 77},
            headerStyle: {minWidth: 96}
          },
          {
            Header: 'History',
            accessor: 'history',
            render: getHistoryButton,
            style: {minWidth: 96, minHeight: 77},
            headerStyle: {minWidth: 96}
          },
          {
            Header: 'Remove',
            accessor: 'remove',
            style: {minWidth: 96, minHeight: 77},
            headerStyle: {minWidth: 96},
          }
        ];
        this.state = {
          columns: columns,
          data: JSON.parse(props.feature_data),
          featureData: JSON.parse(props.feature_data)
        };
      }
      // Method returns Default Status view
      getDefaultStatusView(defaultStatus) {
        return (
          <div>
            {defaultStatus.override_percentage && <div className="text_alert text_bold margin_bottom_small">Override</div>}
            <a className="wfa_link display_block detail_status_storenames" href={defaultStatus.store_url}>
              {defaultStatus.store_name}
            </a>
            <strong>{defaultStatus.default_enabled_percentage}%</strong>
            <div className="status_bar">
              <span className="status_bar_complete" style={{ width: defaultStatus.default_enabled_percentage + '%'}} />
            </div>
          </div>
        );
      }
      // returns the elements for brand settings in detailed settings
      iterateBrandSettings(brandSettings, brandNames) {
        let x;
        let percentage;
        let name;
        const newList = [];
        for (x in brandSettings) {
          percentage = brandSettings[x].enabled_percentage;
          name = brandNames[x];
          newList.push(
            <div className="text_left ws_nowrap margin_bottom_medium">
              <strong>
                {name}:
              </strong>
              {percentage}%
            </div>);
        }
        return (newList);
      }
      // Method returns elements for store_settings
      // in Detailed Settings col
      iterateSettings(storeSettings, storeNames, storeUrls) {
        let x;
        let percentage;
        let name;
        const newList = [];
        let hlink;
        for (x in storeSettings) {
          percentage = storeSettings[x].enabled_percentage;
          name = storeNames[x];
          hlink = storeUrls[x];
          newList.push(
            <a
              className="wfa_link ws_nowrap margin_bottom_medium display_block"
              href={hlink}
            >
              {name}:({percentage}%)
            </a>
          );
        }
        return (newList);
      }
      // Method returns elements for subentity_settings
      // in Detailed Settings col
      iterateSubentitySettings(subentitySettings, subentityNames) {
        let x;
        let percentage;
        let name;
        const newList = [];
        for (x in subentitySettings) {
          percentage = subentitySettings[x].enabled_percentage;
          name = subentityNames[x];
          newList.push(
            <div className="text_left ws_nowrap margin_bottom_medium">
              <strong>
                {name}:
              </strong>
              {percentage}%
            </div>
          );
        }
        return (newList);
      }
      // return date for 'date released' col
      convertTime(dateReleased) {
        const momentTime = new Moment(dateReleased * 1000).format('MM/DD/YYYY');
        return momentTime.toString();
      }
      // method returns  time for 'Last Updated' col
      getUpdateTime(dateUpdated) {
        const momentTime = new Moment(dateUpdated * 1000).format('MM/DD/YYYY, hh:mm:ss a');
        return (
          <div className="last_updated_div">
            <p>{momentTime.toString()}</p>
          </div>);
      }
      // return detailed status col elements
      getDetailedStatus(detailedStatus, key) {
        return (
          <div>
            {detailedStatus.override_percentage &&
            <div className="text_alert text_bold margin_bottom_small">Override Active</div>
            }
            {(Object.keys(detailedStatus.store_settings).length > 0) &&
            <div className="text_bold">Stores</div>}
            {detailedStatus.store_settings &&
            <div>{this.iterateSettings(detailedStatus.store_settings, key.detailed_status_data.store_names,
              key.detailed_status_data.store_urls)}
            </div>
            }
            {(Object.keys(detailedStatus.subentity_settings).length > 0) &&
            <div className="text_bold">Subentities</div>}
            {(Object.keys(detailedStatus.subentity_settings).length > 0) &&
            <div>{this.iterateSubentitySettings(detailedStatus.subentity_settings,
              key.detailed_status_data.subentity_names)}
            </div>
            }
            {(Object.keys(detailedStatus.brand_settings).length > 0) &&
            <div className="text_bold">Brands</div>
            }
            {(Object.keys(detailedStatus.brand_settings).length > 0)&&
            <div>
              {this.iterateBrandSettings(detailedStatus.brand_settings, key.detailed_status_data.brand_names)}
            </div>
            }
            {(Object.keys(detailedStatus.store_settings).length === 0) &&
            (Object.keys(detailedStatus.subentity_settings).length === 0) &&
            (Object.keys(detailedStatus.brand_settings).length === 0) &&
            <span className="text_italic">No details</span>
            }
          </div>
        );
      }
      // creates the pop up window when Remove Button is clicked
      handleRemoveToggle(e) {
        if (!confirm('Are you sure you would like to remove Feature Toggle ' + e.target.name)) {
          e.preventDefault();
        }
      }
      // returns remove Button with size defined by sizeTable
      getRemoveButton(key) {
        return (
          <span>
            <Button
              onClick={this.handleRemoveToggle}
              href={'/v/feature/delete_feature?id=' + encodeURIComponent(key.feature.id) + '&name=' + (key.feature.name)}
              sizeTable
            >Remove
            </Button>
          </span>
        );
      }
      /* *************End of Button and Settings******************************************/
      // method returns data in correct format for each column for Table component
      iterateOverFeatures = () => {
        return this.state.featureData.map((key) => ({
          'date_released': (key.feature.date_released ? this.convertTime(key.feature.date_released) : 'Not released yet'),
          'name': key.feature.name,
          'description_html': key.feature.description,
          'group': key.feature.group,
          'default_status': this.getDefaultStatusView(key.default_status),
          'detailed_status': this.getDetailedStatus(key.feature, key),
          'history': key.feature.id,
          'date_updated': this.getUpdateTime(key.feature.date_updated),
          'remove': this.getRemoveButton(key)
        }));
      };
      // render the React component
      render() {
        return (
          <div>
            <div className="main_content">
              {this.props.is_valid_deploy_time &&
              <div>
                <Alert variation="alert">
                  This is currently a non-deploy window.
                  Only critical toggles should be edited at this time.
                </Alert>
              </div>
              }
              <a className="wfa_btn_secondary fr" href="/v/feature/edit_react">Add a feature toggle</a>
              <div className="wfa_form_inline margin_bottom_medium">
                <form method="get" className="wfa_input_group">
                  <TextInput label="" variation="input" name="search_term" placeholder="Search" />
                  <Button secondary type="submit">Search All Toggles</Button>
                </form>
              </div>
              <Table
                getProps={() => ({className: 'feature_toggles_list_all'})}
                data={this.iterateOverFeatures()}
                columns={this.state.columns}
                resizable
                filterable
                defaultPageSize={10}
                striped
              />
            </div>
          </div>
        );
      }
    }
    return style.hoc(FeatureToggleListComponent);
  }
);
