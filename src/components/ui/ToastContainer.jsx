import { ToastContainer as ReactToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/CustomToast.css';

/**
 * ToastContainer - Custom toast container with our Toast component
 * 
 * Wraps react-toastify's ToastContainer and uses our custom Toast component
 * for consistent styling across the application.
 */

const ToastContainer = ({ isDark = false }) => {
  return (
    <ReactToastifyContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={true}
      theme={isDark ? 'dark' : 'light'}
      limit={3}
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-toast-progress"
      style={{
        width: 'auto',
        minWidth: '260px',
        maxWidth: '360px',
        padding: 0
      }}
    />
  );
};

export default ToastContainer;
