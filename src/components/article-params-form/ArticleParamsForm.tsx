import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { FormEvent } from 'react';
import type { ArticleStateType, OptionType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [draft, setDraft] = useState<ArticleStateType>(defaultArticleState);
  const rootRef = useRef<HTMLDivElement>(null);

  // закрытие по клику вне сайдбара
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent): void => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen]);

  const handleToggle = (): void => setIsOpen((prev) => !prev);

  const handleChange =
    (field: keyof ArticleStateType) =>
    (option: OptionType): void => {
      setDraft((prev) => ({ ...prev, [field]: option }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDraft(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>

          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={draft.fontFamilyOption}
            onChange={handleChange('fontFamilyOption')}
          />

          <RadioGroup
            name="fontSize"
            title="Размер шрифта"
            options={fontSizeOptions}
            selected={draft.fontSizeOption}
            onChange={handleChange('fontSizeOption')}
          />

          <Select
            title="Цвет шрифта"
            options={fontColors}
            selected={draft.fontColor}
            onChange={handleChange('fontColor')}
          />

          <Separator />

          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={draft.backgroundColor}
            onChange={handleChange('backgroundColor')}
          />

          <Select
            title="Ширина контента"
            options={contentWidthArr}
            selected={draft.contentWidth}
            onChange={handleChange('contentWidth')}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
