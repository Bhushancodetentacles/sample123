import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { X } from 'lucide-react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupModals({ open, onDialogClose, children }) {

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(e, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          } else {
            return onDialogClose(false)
          }
          }
        }
        // onClose={onDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >

        <DialogContent className='w-full  card-bg-border !p-10 gap-5 !border-primaryGray-700 !rounded-xl flex flex-col' >
          <span className='text-right  ml-auto' >
            <X className='cursor-pointer' style={{cursor:'pointer'}} onClick={() => onDialogClose(false)} />
          </span>
          {children}
        </DialogContent>
      </Dialog>

    </div>
  );
}
