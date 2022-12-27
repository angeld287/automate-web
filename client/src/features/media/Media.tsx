import React from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  createMedia,
  selectMedia
} from './mediaSlice';
import styles from './Media.module.css';

export function Media() {
  const media = useAppSelector(selectMedia);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => dispatch(createMedia({
            alt_text: "Aceite es muy espeso",
            title: "Aceite es muy espeso",
            caption: "Aceite es muy espeso",
            description: "Aceite es muy espeso",
            id: "498"
          }))}
        >
          Update Media
        </button>
      </div>
    </div>
  );
}
