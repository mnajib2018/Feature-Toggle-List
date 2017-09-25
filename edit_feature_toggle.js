define('edit_feature_toggles',
  [
    'react',
    'admin_button',
    'admin_text_input',
    'admin_modal',
    'admin_card',
    'admin_checkbox',
    'admin_select',
    'admin_heading',
    'wf_ajax',
    'admin_grid',
    'feature_toggle_history_modal',
    'add_edit_tables_component',
    'add_edit_ios_android_table_component',
    'admin_float_label_input',
    'pl_text_input'
  ],
  function(React, Button, TextInput, Modal, CardComponents, Checkbox, Select, HeadingComponents, wfAjax, GridComponents, HistoryButton, SettingsTable, MobileTable,FlTextInput,PlTextInput) {
    'use strict';
    const {PropTypes} = React;
    const {Col,Grid} = GridComponents;
    const {Card, CardTitle, CardBody} = CardComponents;

    class showButton extends React.Component {
      constructor(props) {
        super(props);
        if (this.props.feature_approvals) {
          var businessReviewer = '';
          var techReviewer = '';
          var selfTested = false; //im not sure this default value is correct im going to have to check on that.
          if (this.props.feature_approvals.length !== 0){
            businessReviewer = this.props.feature_approvals['business']['emID'];
            techReviewer = this.props.feature_approvals['technical']['emID'];
            selfTested = this.props.feature_approvals['tested']['status'];
          }
        }
        this.state = {
          isModalOpen: false,

          // those state values are for the feature, not the page.
          featureName: this.props.feature_name,
          description: this.props.feature_description,
          defaultEnabledPercentage: this.props.feature_default_percentage,
          defaultOverridePercentage: this.props.feature_override_percentage,
          stickyValue: this.props.feature_sticky,
          synchronousSaveValue:this.props.feature_synchronous_save,
          exportValue:this.props.feature_frontend,
          longtermValue: this.props.feature_longterm_support,
          groupValue:this.props.feature_group,
          releaseDate: this.props.feature_release_date,
          // why is androidDefaultPercentage undefined sometimes?
          androidDefaultPercentage: this.props.feature_android_default_enabled_percentage,
          androidOverridePercentage: this.props.feature_android_override_percentage,
          androidMinVersion: this.props.feature_android_min_version,
          iosDefaultPercentage: this.props.feature_ios_default_enabled_percentage,
          iosOverridePercentage: this.props.feature_ios_override_percentage,
          iosMinVersion: this.props.feature_ios_min_version,
          ticketNumber: this.props.feature_ticket_number,
          businessReviewerValue:businessReviewer,
          techReviewerValue: techReviewer,

          //checkboxes
          selfTestedCheckbox: selfTested,
          financiallyRelevantCheckbox: this.props.feature_financially_relevant,
          overrideCheckbox: false,
          iosOverrideCheckbox: false,
          androidOverrideCheckbox: false,

          //errors
          store_settings_errors:this.props.store_settings_errors,
          description_error: this.props.description_error,
          default_enabled_percentage_error: this.props.default_enabled_percentage_error,
          override_percentage_error: this.props.override_percentage_error,
          store_settings_table_errors: this.props.store_settings_table_errors,
        };
        this.activateModal = this.activateModal.bind(this);
        this.deactivateModal = this.deactivateModal.bind(this);
        this.createNewObject = this.createNewObject.bind(this);
        this.cancelInput = this.cancelInput.bind(this);
      }
      
      /*
      checkboxChange(){
           this.setState(prevState => ({
           checked: !prevState.checked
           }));
           */
      activateModal() {
        this.setState(prevState => ({
          isModalOpen: !prevState.isModalOpen
        }));
      }
      deactivateModal() {
        this.setState(prevState => ({
          isModalOpen: !prevState.isModalOpen
        }));
      }
      /**
       * Make an ajax request to insert the new object into the database
       */
      createNewObject = () => {
        if (this.state.objectName === '') {
          return;
        }
        const data = {
          name: this.state.featureName,
          description: this.state.description,
          group:this.state.groupValue,
          sticky: this.state.stickyValue,
          synchronous_save:this.state.synchronousSaveValue,
          longterm: this.state.longtermValue,
          frontend_export:this.state.exportValue,
          // percentages
          default_enabled_percentage: this.state.defaultEnabledPercentage,
          override_percentage: this.state.defaultOverridePercentage,
          ios_default_enabled_percentage: this.state.iosDefaultPercentage,
          android_default_enabled_percentage: this.state.androidDefaultPercentage,
          android_override_percentage: this.state.androidOverridePercentage,
          ios_override_percentage: this.state.iosOverridePercentage,
          // approvals: this.state.approvals (this should be an array),
          android_min_version: this.state.androidMinVersion,
          ios_min_version: this.state.iosMinVersion,
          tech_reviewer: this.state.techReviewerValue,
          business_reviewer: this.state.businessReviewerValue,
          ticket: this.state.ticketNumber,
          // why isnt financially_relevant requested on the save function?
          // unclear how releaseDate is works, is the date just retrieved server side? probs
          //
          // checkboxes:
          self_tested: this.state.selfTestedCheckbox ? 1 : 0,
          override_enabled: this.state.overrideCheckbox ? 1 : 0,
          ios_override_enabled: this.state.iosOverrideCheckbox ? 1 : 0,
          android_override_enabled: this.state.androidOverrideCheckbox ? 1 : 0

          /*for the tables there will be 4 vars to send per table:
            for example in the stores table:
            stores_enabled
            stores_percentages
            stores_qaed
            stores_translated
            I think every column will be an array held in one of those vars that holds the rows for every elem
            also i dont understand why the data for the ios and android table is not sent back
           */
        };
        wfAjax.ajax({
          url: '/a/feature/save',
          dataType: 'json',
          data: data
        }).done( (response) => {
          alert('Object created successfully!');
          //this.setState({objectList: response.objects});
        }).fail(() => {
          alert('Object creation failed.');
        });
        this.cancelInput();
      };
      cancelInput = () => {
        this.setState({
          isModalOpen: false,
          featureName: '',
          description: '',
          enabledPercentageValue: 0,
          overrideState: false,
          overrideValue: 0,
          stickyValue: 0,
          synchronousSaveValue:0,
          exportValue:0,
          longtermValue: 0,
          groupValue:0
        });
      };


      render() {
        return (
          <Card>
            <CardTitle title="" />
            <CardBody>
              <p>YESS</p>
              <div className="wfa_row">
                <div className="col_10 offset_1">
                  <div className="text_right">
                    <span>
                      <HistoryButton
                        name={this.props.feature_name}
                        featureID={this.props.feature_ID}
                      />
                    </span>
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <label className="wfa_label is_required" htmlFor="ft-description">Feature Name</label>
                    <p className="wfa_input_description">
                      Name features positively.
                    </p>
                    <TextInput
                      placeholder=""
                      label=""
                      value={this.state.featureName}
                      onChange={(e) => {
                        this.setState({featureName: e.target.value});
                      }}
                    />
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <label className="wfa_label is_required" htmlFor="ft-description">Description</label>
                    <p className="wfa_input_description">
                      Feature toggles are used by many different teams, so make sure that your description is specific
                      and useful to people who are not familiar with your work.
                    </p>
                    <FlTextInput
                      placeholder=""
                      label=""
                      isTextarea
                      isInvalid={this.state.description_error}
                      validityMessage={this.state.description_error}
                      rowCount={8}
                      value={this.state.description}
                      onChange={(e) => {
                        this.setState({description: e.target.value});
                      }}
                    />
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <Grid>
                      <Col size={3}>
                        <div>
                          <label className="wfa_label" htmlFor="default_enabled_percentage">Default Enabled
                            Percentage</label>
                          <FlTextInput
                            placeholder="0"
                            label=""
                            value = {this.state.default_enabled_percentage}
                            isInvalid={this.state.default_enabled_percentage_error}
                            validityMessage={this.state.default_enabled_percentage_error}
                            onChange={(e) => {
                              this.setState({defaultEnabledPercentage: e.target.value});
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        size={1}
                        offset={1}
                      >
                        <div>
                          <label className="wfa_label" htmlFor="checkbox"> Override </label>
                          <Checkbox
                            label=" "
                            onChange={(e) => { this.setState({overrideCheckbox: e.target.checked}); }}
                            checked={this.state.overrideCheckbox}
                          />
                        </div>
                      </Col>
                      <Col
                        size={3}
                      >
                        <label className="wfa_label" htmlFor="default_enabled_percentage">Override Percentage</label>
                        <FlTextInput
                          placeholder="0"
                          label=""
                          value={this.state.defaultOverridePercentage}
                          isInvalid={this.state.override_percentage_error}
                          validityMessage={this.state.override_percentage_error}
                          onChange={(e) => {
                            this.setState({defaultOverridePercentage: e.target.value});
                          }}
                        />
                      </Col>

                      <Col
                        offset={1}
                        size={2}
                      />
                    </Grid>
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <Grid>
                      <Col size={3}>
                        <div>
                          <label className="wfa_label" htmlFor="default_enabled_percentage">Android Enabled
                            Percentage</label>
                          <FlTextInput
                            placeholder="0"
                            label=""
                            value = {this.state.androidDefaultPercentage}
                            onChange={(e) => {
                              this.setState({androidDefaultPercentage: e.target.value});
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        size={1}
                        offset={1}
                      >
                        <div>
                          <label className="wfa_label" htmlFor="checkbox"> Override </label>
                          <Checkbox
                            label=" "
                            onChange={(e) => { this.setState({androidOverrideCheckbox: e.target.checked}); }}
                            checked={this.state.androidOverrideCheckbox}
                          />
                        </div>
                      </Col>
                      <Col
                        size={3}

                      >
                        <label className="wfa_label" htmlFor="default_enabled_percentage">Android Override
                          Percentage</label>
                        <FlTextInput
                          placeholder="0"
                          label=""
                          value = {this.state.androidOverridePercentage}
                          onChange={(e) => {
                            this.setState({androidOverridePercentage: e.target.value});
                          }}
                        />
                      </Col>
                      <Col
                        offset={1}
                        size={2}
                      >
                        <div>
                          <label className="wfa_label" htmlFor="default_enabled_percentage">Android Min Version </label>
                          <FlTextInput
                            placeholder="0"
                            label=""
                            value={this.state.androidMinVersion}
                            onChange={(e) => {
                              this.setState({androidMinVersion: e.target.value});
                            }}
                          />
                        </div>
                      </Col>
                    </Grid>
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <Grid>
                      <Col size={3}>
                        <div>
                          <label className="wfa_label" htmlFor="default_enabled_percentage">iOS Default Enabled
                            Percentage</label>
                          <FlTextInput
                            placeholder="0"
                            label=""
                            value = {this.state.iosDefaultPercentage}

                            onChange={(e) => {
                              this.setState({iosDefaultPercentage: e.target.value});
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        size={1}
                        offset={1}
                      >
                        <div>
                          <label className="wfa_label" htmlFor="checkbox"> Override </label>
                          <Checkbox
                            label=" "
                            onChange={(e) => { this.setState({iosOverrideCheckbox: e.target.checked}); }}
                            checked={this.state.iosOverrideCheckbox}
                          />
                        </div>
                      </Col>
                      <Col
                        size={3}
                      >
                        <label className="wfa_label" htmlFor="default_enabled_percentage"> iOS Override
                          Percentage</label>
                        <FlTextInput
                          placeholder="0"
                          label=""
                          value = {this.state.iosOverridePercentage}
                          onChange={(e) => {
                            this.setState({iosOverridePercentage: e.target.value});
                          }}
                        />
                      </Col>

                      <Col
                        offset={1}
                        size={2}
                      >
                        <div>
                          <label className="wfa_label" htmlFor="default_enabled_percentage">iOS Min Version </label>
                          <FlTextInput
                            placeholder="0"
                            label=""
                            value={this.state.iosMinVersion}
                            onChange={(e) => {
                              this.setState({iosMinVersion: e.target.value});
                            }}
                          />
                        </div>
                      </Col>
                    </Grid>
                  </div>
                  <div className="wfa_row margin_bottom_large">
                    <label className="wfa_label " htmlFor="ft-description">Sticky</label>
                    <Select
                      label<
