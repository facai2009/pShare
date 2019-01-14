import { connect } from 'react-redux'
import { RendererRootState } from '../../shared/reducers/index'
import { Sync, SyncDispatchProps, SyncStateProps } from '../components/Sync';
import { MapPropsToDispatchObj } from '../../shared/system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SyncStateProps => {
    return {
        isComplete:state.sync.isComplete,
        progressPercent:state.sync.progressPercent,
        syncStarted:state.sync.syncStarted
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<SyncDispatchProps> = { };

export default connect(mapStateToProps, mapDispatchToProps)(Sync)